#!/usr/bin/env node

/**
 * Smart Tourist Safety System - Database Restore Script
 * Disaster recovery with data integrity validation and automated verification
 * 
 * 🔄 DISASTER RECOVERY - Complete database restoration
 * ✅ INTEGRITY VALIDATION - Data integrity verification
 * 🔐 DECRYPTION - Decrypt backup files securely
 * 📦 DECOMPRESSION - Restore from compressed backups
 * 🎯 SELECTIVE RESTORE - Table-specific restoration
 * 🔙 ROLLBACK - Safe rollback capabilities
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const crypto = require('crypto');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');
const util = require('util');
const readline = require('readline');

// Convert exec to promise
const execAsync = util.promisify(exec);

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'tourist_safety',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  
  // Restore configuration
  restore: {
    baseDir: process.env.BACKUP_DIR || './backups',
    tempDir: process.env.TEMP_DIR || './temp/restore',
    encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || '',
    validateIntegrity: true,
    createBackupBeforeRestore: true,
    timeoutMs: 300000 // 5 minutes
  }
};

// ============================================================================
// RESTORE MANAGER CLASS
// ============================================================================

class DatabaseRestoreManager {
  constructor() {
    this.startTime = new Date();
    this.restoreId = this.generateRestoreId();
    this.tempDir = path.join(config.restore.tempDir, this.restoreId);
    this.logFile = path.join(config.restore.baseDir, 'logs', `restore_${this.restoreId}.log`);
    this.preRestoreBackup = null;
    this.metadata = {
      id: this.restoreId,
      timestamp: this.startTime.toISOString(),
      status: 'started',
      sourceBackup: '',
      errors: [],
      validationResults: {}
    };
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  async initialize() {
    console.log(`[RestoreManager] Initializing restore ${this.restoreId}...`);
    
    // Create necessary directories
    await fs.mkdir(config.restore.baseDir, { recursive: true });
    await fs.mkdir(path.join(config.restore.baseDir, 'logs'), { recursive: true });
    await fs.mkdir(this.tempDir, { recursive: true });
    
    // Initialize log file
    await this.log('Restore process started');
    
    // Check dependencies
    await this.checkDependencies();
    
    console.log(`[RestoreManager] Restore ${this.restoreId} initialized successfully`);
  }

  async checkDependencies() {
    try {
      // Check psql availability
      await execAsync('psql --version');
      await this.log('psql is available');
    } catch (error) {
      throw new Error('psql is not available. Please install PostgreSQL client tools.');
    }

    // Check database connectivity
    try {
      const connectionString = this.buildConnectionString();
      await execAsync(`pg_isready -d "${connectionString}"`);
      await this.log('Database connection verified');
    } catch (error) {
      await this.log(`Database connection failed: ${error.message}`, 'error');
      throw new Error('Cannot connect to database');
    }
  }

  // ==========================================================================
  // BACKUP DISCOVERY AND SELECTION
  // ==========================================================================

  async listAvailableBackups() {
    const metadataFile = path.join(config.restore.baseDir, 'metadata.json');
    
    try {
      const data = await fs.readFile(metadataFile, 'utf8');
      const metadata = JSON.parse(data);
      
      return metadata
        .filter(backup => backup.status === 'completed')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map(backup => ({
          id: backup.id,
          type: backup.type,
          timestamp: backup.timestamp,
          size: backup.size,
          tables: backup.tables || [],
          destination: backup.destination
        }));
    } catch (error) {
      await this.log(`Could not read backup metadata: ${error.message}`, 'error');
      return [];
    }
  }

  async selectBackup(backupId) {
    const availableBackups = await this.listAvailableBackups();
    const backup = availableBackups.find(b => b.id === backupId);
    
    if (!backup) {
      throw new Error(`Backup with ID ${backupId} not found`);
    }
    
    // Verify backup file exists
    try {
      await fs.access(backup.destination);
      this.metadata.sourceBackup = backup.destination;
      await this.log(`Selected backup: ${backup.id} (${backup.type})`);
      return backup;
    } catch (error) {
      throw new Error(`Backup file not found: ${backup.destination}`);
    }
  }

  async getLatestBackup(type = null) {
    const availableBackups = await this.listAvailableBackups();
    
    let filtered = availableBackups;
    if (type) {
      filtered = availableBackups.filter(b => b.type === type);
    }
    
    if (filtered.length === 0) {
      throw new Error(`No ${type || ''} backups available`);
    }
    
    return filtered[0]; // Already sorted by timestamp desc
  }

  // ==========================================================================
  // RESTORE OPERATIONS
  // ==========================================================================

  async restoreFromBackup(backupId, options = {}) {
    const {
      tables = null, // Restore specific tables only
      skipValidation = false,
      skipPreBackup = false,
      force = false
    } = options;

    console.log(`[RestoreManager] Starting restore from backup ${backupId}...`);
    
    try {
      // Step 1: Select and validate backup
      const backup = await this.selectBackup(backupId);
      await this.log(`Restoring from backup: ${backup.id}`);
      
      // Step 2: Create pre-restore backup (unless skipped)
      if (!skipPreBackup && config.restore.createBackupBeforeRestore) {
        await this.createPreRestoreBackup();
      }
      
      // Step 3: Validate backup integrity
      if (!skipValidation && config.restore.validateIntegrity) {
        await this.validateBackupIntegrity(backup);
      }
      
      // Step 4: Prepare backup file for restore
      const restoreFile = await this.prepareBackupFile(backup.destination);
      
      // Step 5: Confirm restore operation
      if (!force) {
        const confirmed = await this.confirmRestore(backup, tables);
        if (!confirmed) {
          await this.log('Restore operation cancelled by user');
          return false;
        }
      }
      
      // Step 6: Perform database restore
      await this.performRestore(restoreFile, backup, tables);
      
      // Step 7: Verify restored data
      await this.verifyRestoredData(backup, tables);
      
      // Step 8: Cleanup
      await this.cleanup();
      
      this.metadata.status = 'completed';
      console.log(`[RestoreManager] Restore completed successfully!`);
      
      return true;
      
    } catch (error) {
      this.metadata.status = 'failed';
      this.metadata.errors.push(error.message);
      await this.log(`Restore failed: ${error.message}`, 'error');
      
      // Attempt rollback if pre-restore backup exists
      if (this.preRestoreBackup && options.autoRollback !== false) {
        await this.attemptRollback();
      }
      
      throw error;
    }
  }

  async restoreLatest(type = 'full', options = {}) {
    const latestBackup = await this.getLatestBackup(type);
    return await this.restoreFromBackup(latestBackup.id, options);
  }

  async restoreTable(backupId, tableName, options = {}) {
    return await this.restoreFromBackup(backupId, {
      ...options,
      tables: [tableName]
    });
  }

  // ==========================================================================
  // BACKUP PREPARATION
  // ==========================================================================

  async createPreRestoreBackup() {
    await this.log('Creating pre-restore backup...');
    
    try {
      // Use the backup script to create a quick backup
      const backupScript = path.join(__dirname, 'backup-database.js');
      const { stdout, stderr } = await execAsync(`node "${backupScript}" full`);
      
      if (stderr && !stderr.includes('Warning')) {
        throw new Error(`Pre-restore backup failed: ${stderr}`);
      }
      
      // Extract backup ID from output
      const backupIdMatch = stdout.match(/Backup ID: ([^\n]+)/);
      if (backupIdMatch) {
        this.preRestoreBackup = backupIdMatch[1];
        await this.log(`Pre-restore backup created: ${this.preRestoreBackup}`);
      }
      
    } catch (error) {
      await this.log(`Warning: Could not create pre-restore backup: ${error.message}`, 'warn');
      // Don't fail the restore for this
    }
  }

  async validateBackupIntegrity(backup) {
    await this.log('Validating backup integrity...');
    
    try {
      // Check file exists and is readable
      const stats = await fs.stat(backup.destination);
      
      if (stats.size === 0) {
        throw new Error('Backup file is empty');
      }
      
      if (backup.size && stats.size !== backup.size) {
        await this.log(`Warning: Backup file size mismatch. Expected: ${backup.size}, Actual: ${stats.size}`, 'warn');
      }
      
      // TODO: Verify checksum if available
      if (backup.checksum) {
        const actualChecksum = await this.calculateChecksum(backup.destination);
        if (actualChecksum !== backup.checksum) {
          throw new Error('Backup file checksum verification failed');
        }
      }
      
      this.metadata.validationResults.integrity = 'passed';
      await this.log('Backup integrity validation passed');
      
    } catch (error) {
      this.metadata.validationResults.integrity = 'failed';
      throw new Error(`Backup integrity validation failed: ${error.message}`);
    }
  }

  async prepareBackupFile(backupFilePath) {
    await this.log('Preparing backup file for restore...');
    
    const fileName = path.basename(backupFilePath);
    let workingFile = backupFilePath;
    
    try {
      // Step 1: Decrypt if encrypted (ends with .enc)
      if (fileName.endsWith('.enc')) {
        const decryptedFile = path.join(this.tempDir, fileName.replace('.enc', ''));
        await this.decryptFile(workingFile, decryptedFile);
        workingFile = decryptedFile;
        await this.log('Backup file decrypted');
      }
      
      // Step 2: Decompress if compressed (ends with .gz)
      if (path.basename(workingFile).endsWith('.gz')) {
        const decompressedFile = path.join(this.tempDir, path.basename(workingFile).replace('.gz', ''));
        await this.decompressFile(workingFile, decompressedFile);
        workingFile = decompressedFile;
        await this.log('Backup file decompressed');
      }
      
      await this.log('Backup file preparation completed');
      return workingFile;
      
    } catch (error) {
      throw new Error(`Failed to prepare backup file: ${error.message}`);
    }
  }

  async decryptFile(sourceFile, targetFile) {
    if (!config.restore.encryptionKey) {
      throw new Error('Encryption key not provided for encrypted backup');
    }
    
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(config.restore.encryptionKey, 'salt', 32);
    
    const readStream = require('fs').createReadStream(sourceFile);
    const writeStream = require('fs').createWriteStream(targetFile);
    
    // Read IV from the beginning of the file
    const iv = Buffer.alloc(16);
    await new Promise((resolve, reject) => {
      readStream.once('readable', () => {
        const chunk = readStream.read(16);
        if (chunk) {
          chunk.copy(iv);
          resolve();
        } else {
          reject(new Error('Could not read IV from encrypted file'));
        }
      });
      readStream.once('error', reject);
    });
    
    const decipher = crypto.createDecipher(algorithm, key);
    await pipeline(readStream, decipher, writeStream);
  }

  async decompressFile(sourceFile, targetFile) {
    const readStream = require('fs').createReadStream(sourceFile);
    const writeStream = require('fs').createWriteStream(targetFile);
    const gunzipStream = zlib.createGunzip();
    
    await pipeline(readStream, gunzipStream, writeStream);
  }

  // ==========================================================================
  // RESTORE EXECUTION
  // ==========================================================================

  async confirmRestore(backup, tables = null) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('\n⚠️  RESTORE CONFIRMATION ⚠️');
    console.log('=====================================');
    console.log(`Backup ID: ${backup.id}`);
    console.log(`Backup Type: ${backup.type}`);
    console.log(`Backup Date: ${backup.timestamp}`);
    console.log(`Backup Size: ${(backup.size / (1024 * 1024)).toFixed(2)} MB`);
    
    if (tables) {
      console.log(`Tables to restore: ${tables.join(', ')}`);
    } else {
      console.log('Restore scope: FULL DATABASE');
    }
    
    console.log(`Target Database: ${config.database.database}`);
    console.log('=====================================');
    console.log('⚠️  THIS WILL OVERWRITE EXISTING DATA ⚠️');
    
    return new Promise((resolve) => {
      rl.question('\nDo you want to proceed? (yes/no): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
      });
    });
  }

  async performRestore(restoreFile, backup, tables = null) {
    await this.log('Performing database restore...');
    
    const connectionString = this.buildConnectionString();
    
    try {
      if (tables && tables.length > 0) {
        // Selective restore for specific tables
        await this.performSelectiveRestore(restoreFile, connectionString, tables);
      } else {
        // Full database restore
        await this.performFullRestore(restoreFile, connectionString);
      }
      
      await this.log('Database restore completed');
      
    } catch (error) {
      throw new Error(`Database restore failed: ${error.message}`);
    }
  }

  async performFullRestore(restoreFile, connectionString) {
    await this.log('Performing full database restore...');
    
    // For full restore, we might want to drop and recreate the database
    // This is a destructive operation, so we're extra careful
    
    const command = `psql "${connectionString}" -f "${restoreFile}"`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: config.restore.timeoutMs
      });
      
      if (stderr && stderr.includes('ERROR')) {
        throw new Error(`Restore errors: ${stderr}`);
      }
      
      await this.log('Full restore executed successfully');
      
    } catch (error) {
      if (error.code === 'TIMEOUT') {
        throw new Error('Restore operation timed out');
      }
      throw error;
    }
  }

  async performSelectiveRestore(restoreFile, connectionString, tables) {
    await this.log(`Performing selective restore for tables: ${tables.join(', ')}`);
    
    // Read the restore file and extract only the relevant sections
    const content = await fs.readFile(restoreFile, 'utf8');
    const tableData = this.extractTableData(content, tables);
    
    // Create a temporary file with only the required data
    const selectiveRestoreFile = path.join(this.tempDir, 'selective_restore.sql');
    await fs.writeFile(selectiveRestoreFile, tableData);
    
    const command = `psql "${connectionString}" -f "${selectiveRestoreFile}"`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: config.restore.timeoutMs
      });
      
      if (stderr && stderr.includes('ERROR')) {
        throw new Error(`Selective restore errors: ${stderr}`);
      }
      
      await this.log('Selective restore executed successfully');
      
    } catch (error) {
      if (error.code === 'TIMEOUT') {
        throw new Error('Selective restore operation timed out');
      }
      throw error;
    }
  }

  extractTableData(content, tables) {
    const lines = content.split('\n');
    const result = [];
    let currentTable = null;
    let inTableData = false;
    
    for (const line of lines) {
      // Check if this is a table data section
      if (line.includes('-- DATA FROM:')) {
        const tableMatch = line.match(/-- DATA FROM: ([^.]+)\.sql/);
        if (tableMatch) {
          currentTable = tableMatch[1].replace('_incremental', '');
          inTableData = tables.includes(currentTable);
        }
      } else if (line.includes('-- SCHEMA') || line.includes('-- SEQUENCES') || line.includes('-- FUNCTIONS')) {
        inTableData = false;
        currentTable = null;
      }
      
      if (inTableData || line.includes('-- SCHEMA')) {
        result.push(line);
      }
    }
    
    return result.join('\n');
  }

  // ==========================================================================
  // VERIFICATION AND VALIDATION
  // ==========================================================================

  async verifyRestoredData(backup, tables = null) {
    await this.log('Verifying restored data...');
    
    try {
      const tablesToVerify = tables || backup.tables || [];
      
      for (const table of tablesToVerify) {
        await this.verifyTable(table);
      }
      
      // Basic database connectivity test
      await this.verifyDatabaseConnectivity();
      
      this.metadata.validationResults.dataVerification = 'passed';
      await this.log('Data verification completed successfully');
      
    } catch (error) {
      this.metadata.validationResults.dataVerification = 'failed';
      await this.log(`Data verification failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async verifyTable(tableName) {
    try {
      const query = `SELECT COUNT(*) FROM ${tableName} LIMIT 1`;
      await this.executeQuery(query);
      await this.log(`Table ${tableName} verification passed`);
    } catch (error) {
      throw new Error(`Table ${tableName} verification failed: ${error.message}`);
    }
  }

  async verifyDatabaseConnectivity() {
    try {
      const query = 'SELECT version()';
      const result = await this.executeQuery(query);
      await this.log('Database connectivity verification passed');
      return result;
    } catch (error) {
      throw new Error(`Database connectivity verification failed: ${error.message}`);
    }
  }

  // ==========================================================================
  // ROLLBACK OPERATIONS
  // ==========================================================================

  async attemptRollback() {
    if (!this.preRestoreBackup) {
      await this.log('No pre-restore backup available for rollback', 'error');
      return false;
    }
    
    await this.log(`Attempting rollback using pre-restore backup: ${this.preRestoreBackup}`);
    
    try {
      // Create a new restore manager for rollback
      const rollbackManager = new DatabaseRestoreManager();
      await rollbackManager.initialize();
      
      // Perform rollback restore
      await rollbackManager.restoreFromBackup(this.preRestoreBackup, {
        force: true,
        skipPreBackup: true,
        skipValidation: true
      });
      
      await this.log('Rollback completed successfully');
      return true;
      
    } catch (error) {
      await this.log(`Rollback failed: ${error.message}`, 'error');
      return false;
    }
  }

  async rollbackToBackup(backupId) {
    console.log(`[RestoreManager] Rolling back to backup ${backupId}...`);
    
    return await this.restoreFromBackup(backupId, {
      force: false,
      skipPreBackup: false,
      skipValidation: false
    });
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  generateRestoreId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `restore_${timestamp}_${random}`;
  }

  buildConnectionString() {
    if (config.database.supabaseUrl && config.database.supabaseServiceKey) {
      // Supabase connection
      const url = new URL(config.database.supabaseUrl);
      return `postgresql://postgres:${config.database.supabaseServiceKey}@${url.hostname}:5432/postgres`;
    } else {
      // Standard PostgreSQL connection
      return `postgresql://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`;
    }
  }

  async executeQuery(query) {
    const connectionString = this.buildConnectionString();
    const command = `psql "${connectionString}" -t -c "${query.replace(/"/g, '\\"')}"`;
    return await execAsync(command);
  }

  async calculateChecksum(filePath) {
    const hash = crypto.createHash('sha256');
    const stream = require('fs').createReadStream(filePath);
    
    return new Promise((resolve, reject) => {
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  async cleanup() {
    await this.log('Cleaning up temporary files...');
    
    try {
      await fs.rmdir(this.tempDir, { recursive: true });
      await this.log('Temporary files cleaned up');
    } catch (error) {
      await this.log(`Warning: Could not clean up temp directory: ${error.message}`, 'warn');
    }
  }

  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    console.log(`[RestoreManager] ${message}`);
    
    try {
      await fs.appendFile(this.logFile, logEntry);
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function showBackupList() {
  const manager = new DatabaseRestoreManager();
  await manager.initialize();
  
  const backups = await manager.listAvailableBackups();
  
  if (backups.length === 0) {
    console.log('No backups available.');
    return;
  }
  
  console.log('\n📋 Available Backups:');
  console.log('='.repeat(80));
  
  backups.forEach((backup, index) => {
    console.log(`${index + 1}. ${backup.id}`);
    console.log(`   Type: ${backup.type}`);
    console.log(`   Date: ${backup.timestamp}`);
    console.log(`   Size: ${(backup.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`   Tables: ${backup.tables.length > 0 ? backup.tables.join(', ') : 'All'}`);
    console.log('');
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help') {
    console.log(`
Database Restore Tool - Smart Tourist Safety System

Usage:
  node restore-database.js list                    # List available backups
  node restore-database.js restore <backup-id>     # Restore from specific backup
  node restore-database.js restore-latest [type]   # Restore from latest backup
  node restore-database.js restore-table <backup-id> <table> # Restore specific table
  node restore-database.js rollback <backup-id>    # Rollback to specific backup

Examples:
  node restore-database.js list
  node restore-database.js restore backup_1634567890_abc123
  node restore-database.js restore-latest full
  node restore-database.js restore-table backup_1634567890_abc123 users
  node restore-database.js rollback backup_1634567890_def456

Options:
  --force           Skip confirmation prompts
  --skip-validation Skip backup integrity validation
  --skip-backup     Skip pre-restore backup creation
  --tables=t1,t2    Restore only specified tables (comma-separated)
`);
    process.exit(0);
  }

  const manager = new DatabaseRestoreManager();

  try {
    await manager.initialize();
    
    // Parse command line options
    const force = args.includes('--force');
    const skipValidation = args.includes('--skip-validation');
    const skipBackup = args.includes('--skip-backup');
    const tablesArg = args.find(arg => arg.startsWith('--tables='));
    const tables = tablesArg ? tablesArg.split('=')[1].split(',') : null;
    
    const options = {
      force,
      skipValidation,
      skipPreBackup: skipBackup,
      tables
    };

    switch (command) {
      case 'list':
        await showBackupList();
        break;
        
      case 'restore':
        const backupId = args[1];
        if (!backupId) {
          console.error('Error: Backup ID required');
          process.exit(1);
        }
        await manager.restoreFromBackup(backupId, options);
        break;
        
      case 'restore-latest':
        const type = args[1] || 'full';
        await manager.restoreLatest(type, options);
        break;
        
      case 'restore-table':
        const tableBackupId = args[1];
        const tableName = args[2];
        if (!tableBackupId || !tableName) {
          console.error('Error: Backup ID and table name required');
          process.exit(1);
        }
        await manager.restoreTable(tableBackupId, tableName, options);
        break;
        
      case 'rollback':
        const rollbackId = args[1];
        if (!rollbackId) {
          console.error('Error: Backup ID required for rollback');
          process.exit(1);
        }
        await manager.rollbackToBackup(rollbackId);
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
    
    console.log('\n✅ Operation completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error(`\n❌ Operation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { DatabaseRestoreManager, config };