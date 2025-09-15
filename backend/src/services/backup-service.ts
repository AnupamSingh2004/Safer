/**
 * Smart Tourist Safety System - Backup Service
 * Comprehensive data backup and disaster recovery system
 * 
 * 🔄 AUTOMATED BACKUPS - Scheduled data backup operations
 * 🔐 ENCRYPTED STORAGE - Secure backup data encryption
 * ⛓️ BLOCKCHAIN SYNC - Blockchain data synchronization
 * 🏗️ SYSTEM STATE - Critical system state preservation
 * 📦 COMPRESSION - Efficient backup data compression
 * ☁️ MULTI-TARGET - Multiple backup destination support
 */

import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { pipeline } from 'stream/promises';
import path from 'path';
import * as cron from 'node-cron';
import { DatabaseClient } from '@/lib/database';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BackupConfig {
  schedule: {
    full: string; // Cron expression for full backups
    incremental: string; // Cron expression for incremental backups
    blockchain: string; // Cron expression for blockchain sync
  };
  retention: {
    daily: number; // Days to keep daily backups
    weekly: number; // Weeks to keep weekly backups
    monthly: number; // Months to keep monthly backups
  };
  encryption: {
    algorithm: string;
    keyRotationDays: number;
  };
  compression: {
    enabled: boolean;
    level: number; // 1-9
  };
  destinations: BackupDestination[];
}

export interface BackupDestination {
  id: string;
  type: 'local' | 'aws-s3' | 'azure-blob' | 'gcp-storage' | 'ftp';
  config: {
    path?: string;
    bucket?: string;
    accessKey?: string;
    secretKey?: string;
    region?: string;
    endpoint?: string;
  };
  enabled: boolean;
  priority: number; // 1 = highest priority
}

export interface BackupMetadata {
  id: string;
  type: 'full' | 'incremental' | 'blockchain' | 'system-state';
  timestamp: string;
  size: number;
  checksum: string;
  encryptionKey?: string;
  source: string;
  destination: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'corrupted';
  error?: string;
  duration?: number;
  tables?: string[];
  blockchainHeight?: number;
}

export interface SystemState {
  timestamp: string;
  services: ServiceStatus[];
  configurations: ConfigSnapshot[];
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  alertsActive: number;
  touristsOnline: number;
  emergencyContacts: EmergencyContact[];
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  version: string;
  uptime: number;
  lastRestart?: string;
}

export interface ConfigSnapshot {
  service: string;
  config: Record<string, any>;
  checksum: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  priority: number;
}

export interface BackupJob {
  id: string;
  type: BackupMetadata['type'];
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  progress: number; // 0-100
  error?: string;
  metadata?: BackupMetadata;
}

// ============================================================================
// BACKUP SERVICE IMPLEMENTATION
// ============================================================================

export class BackupService {
  private config: BackupConfig;
  private db: DatabaseClient;
  private backupPath: string;
  private currentJobs: Map<string, BackupJob>;
  private cronJobs: Map<string, cron.ScheduledTask>;
  private encryptionKeys: Map<string, Buffer>;

  constructor(
    config: BackupConfig,
    database: DatabaseClient,
    backupBasePath: string = './backups'
  ) {
    this.config = config;
    this.db = database;
    this.backupPath = backupBasePath;
    this.currentJobs = new Map();
    this.cronJobs = new Map();
    this.encryptionKeys = new Map();

    this.initializeBackupDirectory();
    this.scheduleBackups();
    this.loadEncryptionKeys();
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  private async initializeBackupDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.backupPath, { recursive: true });
      await fs.mkdir(path.join(this.backupPath, 'full'), { recursive: true });
      await fs.mkdir(path.join(this.backupPath, 'incremental'), { recursive: true });
      await fs.mkdir(path.join(this.backupPath, 'blockchain'), { recursive: true });
      await fs.mkdir(path.join(this.backupPath, 'system-state'), { recursive: true });
      await fs.mkdir(path.join(this.backupPath, 'keys'), { recursive: true });
      
      console.log('[BackupService] Backup directories initialized');
    } catch (error) {
      console.error('[BackupService] Failed to initialize backup directories:', error);
      throw error;
    }
  }

  private scheduleBackups(): void {
    // Schedule full backups
    if (this.config.schedule.full) {
      const fullBackupJob = cron.schedule(this.config.schedule.full, async () => {
        await this.performFullBackup();
      }, { scheduled: false });
      
      this.cronJobs.set('full', fullBackupJob);
      fullBackupJob.start();
    }

    // Schedule incremental backups
    if (this.config.schedule.incremental) {
      const incrementalBackupJob = cron.schedule(this.config.schedule.incremental, async () => {
        await this.performIncrementalBackup();
      }, { scheduled: false });
      
      this.cronJobs.set('incremental', incrementalBackupJob);
      incrementalBackupJob.start();
    }

    // Schedule blockchain sync
    if (this.config.schedule.blockchain) {
      const blockchainSyncJob = cron.schedule(this.config.schedule.blockchain, async () => {
        await this.performBlockchainSync();
      }, { scheduled: false });
      
      this.cronJobs.set('blockchain', blockchainSyncJob);
      blockchainSyncJob.start();
    }

    console.log('[BackupService] Backup schedules configured');
  }

  private async loadEncryptionKeys(): Promise<void> {
    try {
      const keyPath = path.join(this.backupPath, 'keys');
      const keyFiles = await fs.readdir(keyPath);
      
      for (const keyFile of keyFiles) {
        if (keyFile.endsWith('.key')) {
          const keyData = await fs.readFile(path.join(keyPath, keyFile));
          const keyId = path.parse(keyFile).name;
          this.encryptionKeys.set(keyId, keyData);
        }
      }
    } catch (error) {
      console.warn('[BackupService] No existing encryption keys found, will generate new ones');
    }
  }

  // ========================================================================
  // BACKUP OPERATIONS
  // ========================================================================

  public async performFullBackup(): Promise<BackupMetadata> {
    const jobId = this.generateBackupId('full');
    const job: BackupJob = {
      id: jobId,
      type: 'full',
      status: 'running',
      startTime: new Date().toISOString(),
      progress: 0
    };

    this.currentJobs.set(jobId, job);

    try {
      console.log('[BackupService] Starting full backup...');
      
      // Update progress
      job.progress = 10;
      
      // Get all database tables
      const tables = await this.getDatabaseTables();
      const backupData: any = {};
      
      // Backup each table
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        console.log(`[BackupService] Backing up table: ${table}`);
        
        backupData[table] = await this.backupTable(table);
        job.progress = 10 + ((i + 1) / tables.length) * 60;
      }

      // Include system state
      job.progress = 70;
      backupData.systemState = await this.captureSystemState();

      // Create backup file
      job.progress = 80;
      const metadata = await this.createBackupFile(backupData, 'full', tables);
      
      // Upload to destinations
      job.progress = 90;
      await this.uploadToDestinations(metadata);

      // Cleanup old backups
      job.progress = 95;
      await this.cleanupOldBackups('full');

      job.status = 'completed';
      job.endTime = new Date().toISOString();
      job.progress = 100;
      job.metadata = metadata;

      console.log('[BackupService] Full backup completed:', metadata.id);
      return metadata;

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.endTime = new Date().toISOString();
      
      console.error('[BackupService] Full backup failed:', error);
      throw error;
    }
  }

  public async performIncrementalBackup(): Promise<BackupMetadata> {
    const jobId = this.generateBackupId('incremental');
    const job: BackupJob = {
      id: jobId,
      type: 'incremental',
      status: 'running',
      startTime: new Date().toISOString(),
      progress: 0
    };

    this.currentJobs.set(jobId, job);

    try {
      console.log('[BackupService] Starting incremental backup...');
      
      // Get last backup timestamp
      const lastBackup = await this.getLastBackupTimestamp('incremental');
      job.progress = 10;

      // Get modified data since last backup
      const tables = await this.getDatabaseTables();
      const backupData: any = {};
      
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        console.log(`[BackupService] Checking incremental changes for table: ${table}`);
        
        const changes = await this.getTableChanges(table, lastBackup);
        if (changes.length > 0) {
          backupData[table] = changes;
        }
        
        job.progress = 10 + ((i + 1) / tables.length) * 70;
      }

      // Create incremental backup file
      job.progress = 80;
      const metadata = await this.createBackupFile(backupData, 'incremental', Object.keys(backupData));
      
      // Upload to destinations
      job.progress = 90;
      await this.uploadToDestinations(metadata);

      job.status = 'completed';
      job.endTime = new Date().toISOString();
      job.progress = 100;
      job.metadata = metadata;

      console.log('[BackupService] Incremental backup completed:', metadata.id);
      return metadata;

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.endTime = new Date().toISOString();
      
      console.error('[BackupService] Incremental backup failed:', error);
      throw error;
    }
  }

  public async performBlockchainSync(): Promise<BackupMetadata> {
    const jobId = this.generateBackupId('blockchain');
    const job: BackupJob = {
      id: jobId,
      type: 'blockchain',
      status: 'running',
      startTime: new Date().toISOString(),
      progress: 0
    };

    this.currentJobs.set(jobId, job);

    try {
      console.log('[BackupService] Starting blockchain sync...');
      
      // Get blockchain data (mock implementation)
      job.progress = 20;
      const blockchainData = await this.getBlockchainData();
      
      // Verify blockchain integrity
      job.progress = 50;
      const isValid = await this.verifyBlockchainIntegrity(blockchainData);
      
      if (!isValid) {
        throw new Error('Blockchain integrity check failed');
      }

      // Create blockchain backup
      job.progress = 70;
      const metadata = await this.createBackupFile(blockchainData, 'blockchain');
      metadata.blockchainHeight = blockchainData.latestBlock;

      // Upload to destinations
      job.progress = 90;
      await this.uploadToDestinations(metadata);

      job.status = 'completed';
      job.endTime = new Date().toISOString();
      job.progress = 100;
      job.metadata = metadata;

      console.log('[BackupService] Blockchain sync completed:', metadata.id);
      return metadata;

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.endTime = new Date().toISOString();
      
      console.error('[BackupService] Blockchain sync failed:', error);
      throw error;
    }
  }

  public async captureSystemState(): Promise<SystemState> {
    const timestamp = new Date().toISOString();
    
    // Mock system state capture
    const systemState: SystemState = {
      timestamp,
      services: [
        { name: 'websocket-service', status: 'running', version: '1.0.0', uptime: 86400 },
        { name: 'notification-service', status: 'running', version: '1.0.0', uptime: 86400 },
        { name: 'alert-service', status: 'running', version: '1.0.0', uptime: 86400 },
        { name: 'location-service', status: 'running', version: '1.0.0', uptime: 86400 }
      ],
      configurations: [
        {
          service: 'database',
          config: { maxConnections: 20, timeout: 30000 },
          checksum: this.generateChecksum('database-config')
        },
        {
          service: 'backup',
          config: this.config,
          checksum: this.generateChecksum('backup-config')
        }
      ],
      activeConnections: 150,
      memoryUsage: 75.5,
      cpuUsage: 25.3,
      diskUsage: 45.2,
      alertsActive: 5,
      touristsOnline: 423,
      emergencyContacts: [
        { id: '1', name: 'Emergency Control Room', role: 'primary', phone: '+91-100', email: 'emergency@tourism.gov.in', priority: 1 },
        { id: '2', name: 'Police Control Room', role: 'law-enforcement', phone: '+91-100', email: 'police@gov.in', priority: 2 },
        { id: '3', name: 'Medical Emergency', role: 'medical', phone: '+91-108', email: 'medical@emergency.in', priority: 1 }
      ]
    };

    return systemState;
  }

  // ========================================================================
  // BACKUP FILE OPERATIONS
  // ========================================================================

  private async createBackupFile(
    data: any, 
    type: BackupMetadata['type'], 
    tables?: string[]
  ): Promise<BackupMetadata> {
    const id = this.generateBackupId(type);
    const timestamp = new Date().toISOString();
    const fileName = `${type}_${id}_${timestamp.replace(/[:.]/g, '-')}.backup`;
    const filePath = path.join(this.backupPath, type, fileName);

    // Serialize data
    const jsonData = JSON.stringify(data, null, 2);
    const dataBuffer = Buffer.from(jsonData, 'utf8');

    // Compress if enabled
    let processedData = dataBuffer;
    if (this.config.compression.enabled) {
      processedData = await this.compressData(dataBuffer);
    }

    // Encrypt data
    const encryptionKey = await this.getOrCreateEncryptionKey(id);
    const encryptedData = await this.encryptData(processedData, encryptionKey);

    // Write to file
    await fs.writeFile(filePath, new Uint8Array(encryptedData));

    // Generate metadata
    const metadata: BackupMetadata = {
      id,
      type,
      timestamp,
      size: encryptedData.length,
      checksum: this.generateChecksum(encryptedData),
      source: 'database',
      destination: filePath,
      status: 'completed',
      tables
    };

    // Save metadata
    await this.saveBackupMetadata(metadata);

    return metadata;
  }

  private async compressData(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      const gzip = createGzip({ level: this.config.compression.level });
      
      gzip.on('data', (chunk) => chunks.push(chunk));
      gzip.on('end', () => resolve(Buffer.concat(chunks as Buffer[])));
      gzip.on('error', reject);
      
      gzip.end(data);
    });
  }

  private async encryptData(data: Buffer, key: Buffer): Promise<Buffer> {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.config.encryption.algorithm, new Uint8Array(key), new Uint8Array(iv));
    
    const encrypted = Buffer.concat([
      iv,
      Buffer.from(cipher.update(new Uint8Array(data))),
      Buffer.from(cipher.final())
    ]);

    return encrypted;
  }

  private async getOrCreateEncryptionKey(keyId: string): Promise<Buffer> {
    if (this.encryptionKeys.has(keyId)) {
      return this.encryptionKeys.get(keyId)!;
    }

    const key = randomBytes(32); // 256-bit key
    const keyPath = path.join(this.backupPath, 'keys', `${keyId}.key`);
    
    await fs.writeFile(keyPath, new Uint8Array(key));
    this.encryptionKeys.set(keyId, key);

    return key;
  }

  // ========================================================================
  // DATABASE OPERATIONS
  // ========================================================================

  private async getDatabaseTables(): Promise<string[]> {
    // Mock implementation - in real scenario, query information_schema
    return [
      'users',
      'tourists',
      'alerts',
      'locations',
      'emergency_contacts',
      'notifications',
      'safety_zones',
      'incidents',
      'emergency_responses',
      'user_sessions'
    ];
  }

  private async backupTable(tableName: string): Promise<any[]> {
    try {
      // Mock implementation - in real scenario, use actual database queries
      console.log(`[BackupService] Backing up table: ${tableName}`);
      
      // Simulate table data
      const mockData = this.generateMockTableData(tableName);
      return mockData;
    } catch (error) {
      console.error(`[BackupService] Failed to backup table ${tableName}:`, error);
      throw error;
    }
  }

  private async getTableChanges(tableName: string, sinceTimestamp: string): Promise<any[]> {
    try {
      // Mock implementation - in real scenario, query for modified records
      console.log(`[BackupService] Getting changes for table ${tableName} since ${sinceTimestamp}`);
      
      const mockChanges = this.generateMockTableChanges(tableName, sinceTimestamp);
      return mockChanges;
    } catch (error) {
      console.error(`[BackupService] Failed to get changes for table ${tableName}:`, error);
      throw error;
    }
  }

  private generateMockTableData(tableName: string): any[] {
    const baseCount = 100;
    const data = [];
    
    for (let i = 1; i <= baseCount; i++) {
      switch (tableName) {
        case 'tourists':
          data.push({
            id: `tourist_${i}`,
            name: `Tourist ${i}`,
            email: `tourist${i}@example.com`,
            phone: `+91-9876543${String(i).padStart(3, '0')}`,
            location: { lat: 28.6139 + (i * 0.001), lng: 77.2090 + (i * 0.001) },
            status: 'active',
            created_at: new Date(Date.now() - i * 86400000).toISOString()
          });
          break;
        case 'alerts':
          data.push({
            id: `alert_${i}`,
            type: 'weather',
            severity: 'medium',
            message: `Weather alert ${i}`,
            location: { lat: 28.6139, lng: 77.2090 },
            created_at: new Date(Date.now() - i * 3600000).toISOString()
          });
          break;
        default:
          data.push({
            id: `${tableName}_${i}`,
            data: `Sample data for ${tableName} record ${i}`,
            created_at: new Date(Date.now() - i * 86400000).toISOString()
          });
      }
    }
    
    return data;
  }

  private generateMockTableChanges(tableName: string, sinceTimestamp: string): any[] {
    // Mock implementation - return recent changes
    const since = new Date(sinceTimestamp);
    const now = new Date();
    const changes = [];
    
    // Generate some mock changes
    for (let i = 1; i <= 10; i++) {
      const changeTime = new Date(since.getTime() + (i * (now.getTime() - since.getTime()) / 10));
      changes.push({
        id: `${tableName}_change_${i}`,
        operation: Math.random() > 0.7 ? 'DELETE' : Math.random() > 0.5 ? 'UPDATE' : 'INSERT',
        data: `Changed data for ${tableName}`,
        timestamp: changeTime.toISOString()
      });
    }
    
    return changes;
  }

  // ========================================================================
  // BLOCKCHAIN OPERATIONS
  // ========================================================================

  private async getBlockchainData(): Promise<any> {
    // Mock blockchain data
    return {
      latestBlock: 12345,
      blocks: [
        {
          height: 12345,
          hash: 'abc123def456',
          timestamp: new Date().toISOString(),
          transactions: [
            { id: 'tx1', type: 'emergency_alert', data: 'Emergency alert transaction' },
            { id: 'tx2', type: 'location_update', data: 'Location update transaction' }
          ]
        }
      ],
      state: {
        totalTransactions: 98765,
        activeContracts: 15,
        lastSync: new Date().toISOString()
      }
    };
  }

  private async verifyBlockchainIntegrity(blockchainData: any): Promise<boolean> {
    // Mock integrity verification
    console.log('[BackupService] Verifying blockchain integrity...');
    
    // Simulate verification process
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true); // Mock successful verification
      }, 1000);
    });
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private generateBackupId(type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}_${timestamp}_${random}`;
  }

  private generateChecksum(data: string | Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private async getLastBackupTimestamp(type: string): Promise<string> {
    try {
      const metadataPath = path.join(this.backupPath, 'metadata.json');
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
      
      const lastBackup = metadata
        .filter((m: BackupMetadata) => m.type === type)
        .sort((a: BackupMetadata, b: BackupMetadata) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
      
      return lastBackup ? lastBackup.timestamp : new Date(0).toISOString();
    } catch (error) {
      return new Date(0).toISOString(); // Return epoch if no previous backups
    }
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    try {
      const metadataPath = path.join(this.backupPath, 'metadata.json');
      let existingMetadata: BackupMetadata[] = [];
      
      try {
        const data = await fs.readFile(metadataPath, 'utf8');
        existingMetadata = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, start with empty array
      }
      
      existingMetadata.push(metadata);
      await fs.writeFile(metadataPath, JSON.stringify(existingMetadata, null, 2));
    } catch (error) {
      console.error('[BackupService] Failed to save backup metadata:', error);
    }
  }

  private async uploadToDestinations(metadata: BackupMetadata): Promise<void> {
    const enabledDestinations = this.config.destinations
      .filter(dest => dest.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const destination of enabledDestinations) {
      try {
        await this.uploadToDestination(metadata, destination);
        console.log(`[BackupService] Uploaded backup ${metadata.id} to ${destination.id}`);
      } catch (error) {
        console.error(`[BackupService] Failed to upload backup ${metadata.id} to ${destination.id}:`, error);
        // Continue with other destinations
      }
    }
  }

  private async uploadToDestination(metadata: BackupMetadata, destination: BackupDestination): Promise<void> {
    // Mock implementation for different destination types
    console.log(`[BackupService] Uploading to ${destination.type}: ${destination.id}`);
    
    switch (destination.type) {
      case 'local':
        // Copy to different local path
        if (destination.config.path) {
          await fs.mkdir(destination.config.path, { recursive: true });
          const fileName = path.basename(metadata.destination);
          const destPath = path.join(destination.config.path, fileName);
          await fs.copyFile(metadata.destination, destPath);
        }
        break;
        
      case 'aws-s3':
        // Mock S3 upload
        console.log(`[BackupService] Mock S3 upload to bucket: ${destination.config.bucket}`);
        break;
        
      case 'azure-blob':
        // Mock Azure Blob upload
        console.log(`[BackupService] Mock Azure Blob upload`);
        break;
        
      case 'gcp-storage':
        // Mock GCP Storage upload
        console.log(`[BackupService] Mock GCP Storage upload`);
        break;
        
      case 'ftp':
        // Mock FTP upload
        console.log(`[BackupService] Mock FTP upload to: ${destination.config.endpoint}`);
        break;
    }
  }

  private async cleanupOldBackups(type: string): Promise<void> {
    try {
      const metadataPath = path.join(this.backupPath, 'metadata.json');
      const metadata: BackupMetadata[] = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
      
      const typeBackups = metadata.filter(m => m.type === type);
      const now = new Date();
      const toDelete: BackupMetadata[] = [];
      
      // Determine retention based on type and age
      for (const backup of typeBackups) {
        const backupDate = new Date(backup.timestamp);
        const ageInDays = (now.getTime() - backupDate.getTime()) / (1000 * 60 * 60 * 24);
        
        let shouldDelete = false;
        
        if (ageInDays > this.config.retention.daily && type === 'incremental') {
          shouldDelete = true;
        } else if (ageInDays > this.config.retention.weekly * 7 && type === 'full') {
          shouldDelete = true;
        } else if (ageInDays > this.config.retention.monthly * 30) {
          shouldDelete = true;
        }
        
        if (shouldDelete) {
          toDelete.push(backup);
        }
      }
      
      // Delete old backup files
      for (const backup of toDelete) {
        try {
          await fs.unlink(backup.destination);
          console.log(`[BackupService] Deleted old backup: ${backup.id}`);
        } catch (error) {
          console.warn(`[BackupService] Could not delete backup file: ${backup.destination}`);
        }
      }
      
      // Update metadata
      const updatedMetadata = metadata.filter(m => !toDelete.some(d => d.id === m.id));
      await fs.writeFile(metadataPath, JSON.stringify(updatedMetadata, null, 2));
      
    } catch (error) {
      console.error('[BackupService] Failed to cleanup old backups:', error);
    }
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  public async getBackupStatus(): Promise<{
    activeJobs: BackupJob[];
    recentBackups: BackupMetadata[];
    systemHealth: {
      diskSpace: number;
      lastFullBackup: string;
      lastIncrementalBackup: string;
      lastBlockchainSync: string;
    };
  }> {
    const activeJobs = Array.from(this.currentJobs.values());
    
    try {
      const metadataPath = path.join(this.backupPath, 'metadata.json');
      const metadata: BackupMetadata[] = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
      
      const recentBackups = metadata
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
      
      const lastFull = metadata.filter(m => m.type === 'full').sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      const lastIncremental = metadata.filter(m => m.type === 'incremental').sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      const lastBlockchain = metadata.filter(m => m.type === 'blockchain').sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      return {
        activeJobs,
        recentBackups,
        systemHealth: {
          diskSpace: 85.2, // Mock disk usage percentage
          lastFullBackup: lastFull?.timestamp || 'Never',
          lastIncrementalBackup: lastIncremental?.timestamp || 'Never',
          lastBlockchainSync: lastBlockchain?.timestamp || 'Never'
        }
      };
    } catch (error) {
      return {
        activeJobs,
        recentBackups: [],
        systemHealth: {
          diskSpace: 0,
          lastFullBackup: 'Never',
          lastIncrementalBackup: 'Never',
          lastBlockchainSync: 'Never'
        }
      };
    }
  }

  public async triggerManualBackup(type: BackupMetadata['type']): Promise<BackupMetadata> {
    switch (type) {
      case 'full':
        return await this.performFullBackup();
      case 'incremental':
        return await this.performIncrementalBackup();
      case 'blockchain':
        return await this.performBlockchainSync();
      case 'system-state':
        const systemState = await this.captureSystemState();
        return await this.createBackupFile(systemState, 'system-state');
      default:
        throw new Error(`Unsupported backup type: ${type}`);
    }
  }

  public pauseScheduledBackups(): void {
    this.cronJobs.forEach(job => job.stop());
    console.log('[BackupService] Scheduled backups paused');
  }

  public resumeScheduledBackups(): void {
    this.cronJobs.forEach(job => job.start());
    console.log('[BackupService] Scheduled backups resumed');
  }

  public async shutdown(): Promise<void> {
    // Stop all scheduled jobs
    this.cronJobs.forEach(job => job.stop());
    this.cronJobs.clear();
    
    // Wait for active jobs to complete (with timeout)
    const activeJobs = Array.from(this.currentJobs.values()).filter(job => job.status === 'running');
    if (activeJobs.length > 0) {
      console.log(`[BackupService] Waiting for ${activeJobs.length} active jobs to complete...`);
      
      const timeout = 30000; // 30 seconds timeout
      const start = Date.now();
      
      while (activeJobs.some(job => job.status === 'running') && Date.now() - start < timeout) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('[BackupService] Shutdown complete');
  }
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_BACKUP_CONFIG: BackupConfig = {
  schedule: {
    full: '0 2 * * 0', // Weekly at 2 AM on Sunday
    incremental: '0 */6 * * *', // Every 6 hours
    blockchain: '0 */2 * * *' // Every 2 hours
  },
  retention: {
    daily: 7, // Keep daily backups for 7 days
    weekly: 4, // Keep weekly backups for 4 weeks
    monthly: 12 // Keep monthly backups for 12 months
  },
  encryption: {
    algorithm: 'aes-256-cbc',
    keyRotationDays: 30
  },
  compression: {
    enabled: true,
    level: 6 // Balanced compression
  },
  destinations: [
    {
      id: 'local-primary',
      type: 'local',
      config: { path: './backups/primary' },
      enabled: true,
      priority: 1
    },
    {
      id: 'local-secondary',
      type: 'local',
      config: { path: './backups/secondary' },
      enabled: true,
      priority: 2
    }
  ]
};