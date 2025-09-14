/**
 * Smart Tourist Safety System - End-to-End Encryption
 * Comprehensive encryption module for sensitive data, KYC documents, and emergency communications
 */

import crypto from 'crypto';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
  saltLength: number;
  iterations: number;
}

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  tag: string;
  salt?: string;
}

export interface KYCDocument {
  type: 'passport' | 'aadhaar' | 'driving_license' | 'voter_id';
  number: string;
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
  documentImage?: string;
}

export interface EmergencyMessage {
  touristId: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  emergencyType: 'medical' | 'security' | 'natural_disaster' | 'accident' | 'lost';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  contactNumbers: string[];
}

// ============================================================================
// ENCRYPTION CONFIGURATION
// ============================================================================

export const ENCRYPTION_CONFIG: EncryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32, // 256 bits
  ivLength: 16,  // 128 bits
  tagLength: 16, // 128 bits
  saltLength: 32, // 256 bits
  iterations: 100000 // PBKDF2 iterations
};

// ============================================================================
// CORE ENCRYPTION CLASS
// ============================================================================

class AdvancedEncryption {
  protected masterKey: string;
  private config: EncryptionConfig;

  constructor(masterKey?: string, config?: Partial<EncryptionConfig>) {
    this.masterKey = masterKey || process.env.ENCRYPTION_KEY || this.generateSecureKey();
    this.config = { ...ENCRYPTION_CONFIG, ...config };
  }

  /**
   * Generate a cryptographically secure key
   */
  generateSecureKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Derive key from password using PBKDF2
   */
  private deriveKey(password: string, salt: string | Buffer): Buffer {
    const saltBuffer = typeof salt === 'string' ? Buffer.from(salt, 'hex') : salt;
    return crypto.pbkdf2Sync(password, new Uint8Array(saltBuffer), this.config.iterations, this.config.keyLength, 'sha512');
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  encrypt(data: string, password?: string): EncryptedData {
    try {
      const saltHex = crypto.randomBytes(this.config.saltLength).toString('hex');
      const key = password 
        ? this.deriveKey(password, saltHex)
        : Buffer.from(this.masterKey, 'hex');
      
      const iv = crypto.randomBytes(this.config.ivLength);
      const cipher = crypto.createCipheriv(this.config.algorithm, new Uint8Array(key), new Uint8Array(iv));

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // For GCM mode, get the authentication tag
      const tag = (cipher as any).getAuthTag ? (cipher as any).getAuthTag() : Buffer.alloc(0);

      const result: EncryptedData = {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };

      if (password) {
        result.salt = saltHex;
      }

      return result;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  decrypt(encryptedData: EncryptedData, password?: string): string {
    try {
      const key = password && encryptedData.salt
        ? this.deriveKey(password, encryptedData.salt)
        : Buffer.from(this.masterKey, 'hex');

      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipheriv(this.config.algorithm, new Uint8Array(key), new Uint8Array(iv));
      
      // Set auth tag for GCM mode
      if (encryptedData.tag && (decipher as any).setAuthTag) {
        (decipher as any).setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      }

      let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Encrypt file data (for KYC documents)
   */
  encryptFile(fileBuffer: Buffer, filename: string, password?: string): EncryptedData & { filename: string } {
    const fileData = {
      filename,
      data: fileBuffer.toString('base64'),
      size: fileBuffer.length,
      timestamp: Date.now()
    };

    const encrypted = this.encrypt(JSON.stringify(fileData), password);
    return { ...encrypted, filename: this.hashString(filename) };
  }

  /**
   * Decrypt file data
   */
  decryptFile(encryptedFile: EncryptedData, password?: string): { filename: string; data: Buffer; size: number; timestamp: number } {
    const decryptedString = this.decrypt(encryptedFile, password);
    const fileData = JSON.parse(decryptedString);
    
    return {
      filename: fileData.filename,
      data: Buffer.from(fileData.data, 'base64'),
      size: fileData.size,
      timestamp: fileData.timestamp
    };
  }

  /**
   * Hash string using SHA-256
   */
  hashString(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate digital signature for data integrity
   */
  sign(data: string, privateKey: string): string {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'hex');
  }

  /**
   * Verify digital signature
   */
  verify(data: string, signature: string, publicKey: string): boolean {
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data);
      return verify.verify(publicKey, signature, 'hex');
    } catch (error) {
      return false;
    }
  }
}

// ============================================================================
// KYC DOCUMENT ENCRYPTION
// ============================================================================

class KYCEncryption extends AdvancedEncryption {
  /**
   * Encrypt KYC document with tourist-specific password
   */
  encryptKYCDocument(document: KYCDocument, touristId: string, documentFile?: Buffer): EncryptedData & { documentHash?: string } {
    try {
      // Generate tourist-specific encryption key
      const touristKey = this.generateTouristKey(touristId);
      
      // Prepare document data
      const documentData = {
        ...document,
        touristId,
        encryptedAt: new Date().toISOString(),
        documentHash: documentFile ? this.hashString(documentFile.toString('base64')) : undefined
      };

      // Encrypt the document
      const encrypted = this.encrypt(JSON.stringify(documentData), touristKey);
      
      // If there's a file, encrypt it separately
      let documentHash: string | undefined;
      if (documentFile) {
        const encryptedFile = this.encryptFile(documentFile, `${touristId}_${document.type}`, touristKey);
        documentHash = encryptedFile.filename;
      }

      return { ...encrypted, documentHash };
    } catch (error) {
      throw new Error(`KYC encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt KYC document
   */
  decryptKYCDocument(encryptedDocument: EncryptedData, touristId: string): KYCDocument & { touristId: string; encryptedAt: string } {
    try {
      const touristKey = this.generateTouristKey(touristId);
      const decryptedString = this.decrypt(encryptedDocument, touristKey);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error(`KYC decryption failed: ${error}`);
    }
  }

  /**
   * Generate tourist-specific encryption key
   */
  private generateTouristKey(touristId: string): string {
    const salt = Buffer.from(`sts_kyc_${touristId}`, 'utf8');
    return crypto.pbkdf2Sync(this.masterKey, new Uint8Array(salt), 50000, 32, 'sha512').toString('hex');
  }

  /**
   * Validate KYC document integrity
   */
  validateKYCIntegrity(document: KYCDocument, documentFile?: Buffer): boolean {
    try {
      // Validate required fields
      if (!document.type || !document.number) return false;

      // Validate document number format based on type
      switch (document.type) {
        case 'aadhaar':
          return /^\d{12}$/.test(document.number);
        case 'passport':
          return /^[A-Z]{1}[0-9]{7}$/.test(document.number);
        case 'driving_license':
          return /^[A-Z]{2}[0-9]{13}$/.test(document.number);
        case 'voter_id':
          return /^[A-Z]{3}[0-9]{7}$/.test(document.number);
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}

// ============================================================================
// EMERGENCY COMMUNICATION ENCRYPTION
// ============================================================================

class EmergencyEncryption extends AdvancedEncryption {
  /**
   * Encrypt emergency message with high priority
   */
  encryptEmergencyMessage(message: EmergencyMessage): EncryptedData & { emergencyId: string; priority: number } {
    try {
      // Generate unique emergency ID
      const emergencyId = this.generateEmergencyId(message);
      
      // Determine priority based on severity
      const priority = this.calculatePriority(message.severity, message.emergencyType);
      
      // Add emergency metadata
      const emergencyData = {
        ...message,
        emergencyId,
        priority,
        encryptedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      // Use emergency-specific encryption key
      const emergencyKey = this.generateEmergencyKey(emergencyId);
      const encrypted = this.encrypt(JSON.stringify(emergencyData), emergencyKey);

      return { ...encrypted, emergencyId, priority };
    } catch (error) {
      throw new Error(`Emergency encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt emergency message
   */
  decryptEmergencyMessage(encryptedMessage: EncryptedData & { emergencyId: string }): EmergencyMessage & { emergencyId: string; priority: number } {
    try {
      const emergencyKey = this.generateEmergencyKey(encryptedMessage.emergencyId);
      const decryptedString = this.decrypt(encryptedMessage, emergencyKey);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error(`Emergency decryption failed: ${error}`);
    }
  }

  /**
   * Generate unique emergency ID
   */
  private generateEmergencyId(message: EmergencyMessage): string {
    const data = `${message.touristId}_${message.timestamp}_${message.emergencyType}`;
    return `EMG_${this.hashString(data).substring(0, 16).toUpperCase()}`;
  }

  /**
   * Generate emergency-specific encryption key
   */
  private generateEmergencyKey(emergencyId: string): string {
    const salt = Buffer.from(`sts_emergency_${emergencyId}`, 'utf8');
    return crypto.pbkdf2Sync(this.masterKey, new Uint8Array(salt), 10000, 32, 'sha512').toString('hex');
  }

  /**
   * Calculate message priority
   */
  private calculatePriority(severity: string, type: string): number {
    let priority = 1;

    // Severity multiplier
    switch (severity) {
      case 'critical': priority *= 10; break;
      case 'high': priority *= 5; break;
      case 'medium': priority *= 2; break;
      case 'low': priority *= 1; break;
    }

    // Type multiplier
    switch (type) {
      case 'medical': priority *= 3; break;
      case 'security': priority *= 2.5; break;
      case 'natural_disaster': priority *= 2; break;
      case 'accident': priority *= 2; break;
      case 'lost': priority *= 1; break;
    }

    return Math.min(priority, 100); // Cap at 100
  }

  /**
   * Create secure communication channel
   */
  createSecureChannel(participants: string[]): { channelId: string; channelKey: string } {
    const channelId = `CH_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const channelData = {
      participants: participants.sort(),
      createdAt: new Date().toISOString(),
      channelId
    };
    
    const channelKey = this.hashString(JSON.stringify(channelData));
    return { channelId, channelKey };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate key pair for asymmetric encryption
 */
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  return { publicKey, privateKey };
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash password with salt
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(new Uint8Array(Buffer.from(hash, 'hex')), new Uint8Array(Buffer.from(verifyHash, 'hex')));
}

/**
 * Encrypt data for blockchain storage
 */
export function encryptForBlockchain(data: any): string {
  const encryption = new AdvancedEncryption();
  const encrypted = encryption.encrypt(JSON.stringify(data));
  return Buffer.from(JSON.stringify(encrypted)).toString('base64');
}

/**
 * Decrypt data from blockchain
 */
export function decryptFromBlockchain(encryptedBase64: string): any {
  const encryption = new AdvancedEncryption();
  const encryptedData = JSON.parse(Buffer.from(encryptedBase64, 'base64').toString());
  const decrypted = encryption.decrypt(encryptedData);
  return JSON.parse(decrypted);
}

// ============================================================================
// SECURITY AUDIT FUNCTIONS
// ============================================================================

export class SecurityAuditor {
  /**
   * Audit encryption strength
   */
  static auditEncryptionStrength(config: EncryptionConfig): { score: number; recommendations: string[] } {
    let score = 100;
    const recommendations: string[] = [];

    // Check algorithm
    if (!config.algorithm.includes('aes-256')) {
      score -= 30;
      recommendations.push('Use AES-256 for stronger encryption');
    }

    // Check key length
    if (config.keyLength < 32) {
      score -= 20;
      recommendations.push('Use at least 256-bit keys');
    }

    // Check iterations
    if (config.iterations < 100000) {
      score -= 15;
      recommendations.push('Use at least 100,000 PBKDF2 iterations');
    }

    // Check IV length
    if (config.ivLength < 16) {
      score -= 10;
      recommendations.push('Use at least 128-bit initialization vectors');
    }

    return { score: Math.max(score, 0), recommendations };
  }

  /**
   * Test encryption/decryption performance
   */
  static async performanceTest(encryption: AdvancedEncryption, iterations: number = 1000): Promise<{ encryptionTime: number; decryptionTime: number; throughput: number }> {
    const testData = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(100);
    
    // Encryption test
    const encryptStart = performance.now();
    const encrypted = encryption.encrypt(testData);
    const encryptEnd = performance.now();
    
    // Decryption test
    const decryptStart = performance.now();
    encryption.decrypt(encrypted);
    const decryptEnd = performance.now();
    
    const encryptionTime = encryptEnd - encryptStart;
    const decryptionTime = decryptEnd - decryptStart;
    const throughput = testData.length / ((encryptionTime + decryptionTime) / 1000); // bytes per second
    
    return { encryptionTime, decryptionTime, throughput };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default AdvancedEncryption;
export { AdvancedEncryption, KYCEncryption, EmergencyEncryption };