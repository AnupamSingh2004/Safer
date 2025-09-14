/**
 * Smart Tourist Safety System - SMS Service
 * SMS integration for emergency contacts and mass communication
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SMSMessage {
  id: string;
  recipientId: string;
  phoneNumber: string;
  message: string;
  priority: 'emergency' | 'high' | 'normal' | 'low';
  messageType: 'alert' | 'emergency' | 'broadcast' | 'notification' | 'otp';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'expired';
  language: string;
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  attempts: number;
  maxAttempts: number;
  error?: string;
  metadata?: Record<string, any>;
  emergencyContactId?: string;
  broadcastId?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmergencyContact {
  id: string;
  touristId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  countryCode: string;
  isPrimary: boolean;
  isVerified: boolean;
  language: string;
  timeZone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SMSTemplate {
  id: string;
  name: string;
  type: 'alert' | 'emergency' | 'broadcast' | 'notification' | 'otp';
  priority: 'emergency' | 'high' | 'normal' | 'low';
  template: string;
  variables: string[];
  languages: Record<string, string>;
  maxLength: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BulkSMSRequest {
  recipients: Array<{
    phoneNumber: string;
    recipientId?: string;
    variables?: Record<string, string>;
  }>;
  templateId: string;
  priority: 'emergency' | 'high' | 'normal' | 'low';
  scheduledAt?: string;
  language?: string;
  metadata?: Record<string, any>;
}

interface SMSDeliveryReport {
  totalMessages: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;
  deliveryRate: number;
  averageDeliveryTime: number; // in seconds
  costAnalysis: {
    totalCost: number;
    costPerMessage: number;
    currency: string;
  };
  failureReasons: Record<string, number>;
  byCountry: Record<string, { sent: number; delivered: number; failed: number; cost: number }>;
}

interface EmergencyBroadcastSMS {
  id: string;
  title: string;
  message: string;
  priority: 'emergency' | 'high' | 'normal';
  targetAudience: {
    type: 'all' | 'tourists' | 'authorities' | 'emergency_contacts' | 'custom';
    criteria?: Record<string, any>;
    location?: {
      coordinates: [number, number];
      radius: number; // in kilometers
    };
  };
  languages: string[];
  scheduledAt?: string;
  expiresAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  deliveryStats: SMSDeliveryReport;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: 'ec_001',
    touristId: 'T001',
    name: 'John Doe Sr.',
    relationship: 'Father',
    phoneNumber: '+1234567890',
    countryCode: '+1',
    isPrimary: true,
    isVerified: true,
    language: 'en',
    timeZone: 'America/New_York',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ec_002',
    touristId: 'T001',
    name: 'Jane Doe',
    relationship: 'Mother',
    phoneNumber: '+1234567891',
    countryCode: '+1',
    isPrimary: false,
    isVerified: true,
    language: 'en',
    timeZone: 'America/New_York',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ec_003',
    touristId: 'T002',
    name: 'Mike Wilson',
    relationship: 'Husband',
    phoneNumber: '+4471234567890',
    countryCode: '+44',
    isPrimary: true,
    isVerified: true,
    language: 'en',
    timeZone: 'Europe/London',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSMSTemplates: SMSTemplate[] = [
  {
    id: 'template_emergency_missing',
    name: 'Emergency - Tourist Missing',
    type: 'emergency',
    priority: 'emergency',
    template: 'EMERGENCY: {{touristName}} is missing in {{location}}. Last seen at {{lastSeenTime}}. Contact local authorities: {{emergencyNumber}}. Case ID: {{caseId}}',
    variables: ['touristName', 'location', 'lastSeenTime', 'emergencyNumber', 'caseId'],
    languages: {
      'en': 'EMERGENCY: {{touristName}} is missing in {{location}}. Last seen at {{lastSeenTime}}. Contact local authorities: {{emergencyNumber}}. Case ID: {{caseId}}',
      'hi': 'आपातकाल: {{touristName}} {{location}} में लापता है। अंतिम बार {{lastSeenTime}} पर देखा गया। स्थानीय अधिकारियों से संपर्क करें: {{emergencyNumber}}। केस आईडी: {{caseId}}',
      'es': 'EMERGENCIA: {{touristName}} está desaparecido en {{location}}. Visto por última vez a las {{lastSeenTime}}. Contacte a las autoridades locales: {{emergencyNumber}}. ID del caso: {{caseId}}'
    },
    maxLength: 160,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_emergency_found',
    name: 'Emergency - Tourist Found Safe',
    type: 'emergency',
    priority: 'high',
    template: 'GOOD NEWS: {{touristName}} has been found safe in {{location}}. They are in good health. Case ID: {{caseId}} is now closed.',
    variables: ['touristName', 'location', 'caseId'],
    languages: {
      'en': 'GOOD NEWS: {{touristName}} has been found safe in {{location}}. They are in good health. Case ID: {{caseId}} is now closed.',
      'hi': 'अच्छी खबर: {{touristName}} {{location}} में सुरक्षित मिल गया है। वे स्वस्थ हैं। केस आईडी: {{caseId}} अब बंद है।',
      'es': 'BUENAS NOTICIAS: {{touristName}} ha sido encontrado sano y salvo en {{location}}. Está en buen estado de salud. El caso ID: {{caseId}} está cerrado.'
    },
    maxLength: 160,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_safety_alert',
    name: 'Safety Alert',
    type: 'alert',
    priority: 'high',
    template: 'SAFETY ALERT: {{alertMessage}} in {{location}}. Please follow safety guidelines. For assistance: {{helplineNumber}}',
    variables: ['alertMessage', 'location', 'helplineNumber'],
    languages: {
      'en': 'SAFETY ALERT: {{alertMessage}} in {{location}}. Please follow safety guidelines. For assistance: {{helplineNumber}}',
      'hi': 'सुरक्षा चेतावनी: {{location}} में {{alertMessage}}। कृपया सुरक्षा दिशानिर्देशों का पालन करें। सहायता के लिए: {{helplineNumber}}',
      'es': 'ALERTA DE SEGURIDAD: {{alertMessage}} en {{location}}. Siga las pautas de seguridad. Para asistencia: {{helplineNumber}}'
    },
    maxLength: 160,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_check_in_reminder',
    name: 'Check-in Reminder',
    type: 'notification',
    priority: 'normal',
    template: 'Hello {{touristName}}, please check in to confirm your safety. Last check-in: {{lastCheckIn}}. Reply SAFE if you\'re okay or call {{emergencyNumber}} for help.',
    variables: ['touristName', 'lastCheckIn', 'emergencyNumber'],
    languages: {
      'en': 'Hello {{touristName}}, please check in to confirm your safety. Last check-in: {{lastCheckIn}}. Reply SAFE if you\'re okay or call {{emergencyNumber}} for help.',
      'hi': 'नमस्ते {{touristName}}, कृपया अपनी सुरक्षा की पुष्टि के लिए चेक इन करें। अंतिम चेक इन: {{lastCheckIn}}। यदि आप ठीक हैं तो SAFE का उत्तर दें या सहायता के लिए {{emergencyNumber}} पर कॉल करें।'
    },
    maxLength: 160,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template_otp_verification',
    name: 'OTP Verification',
    type: 'otp',
    priority: 'high',
    template: 'Your SafeTour verification code is {{otp}}. Valid for {{validityMinutes}} minutes. Do not share this code with anyone.',
    variables: ['otp', 'validityMinutes'],
    languages: {
      'en': 'Your SafeTour verification code is {{otp}}. Valid for {{validityMinutes}} minutes. Do not share this code with anyone.',
      'hi': 'आपका SafeTour सत्यापन कोड {{otp}} है। {{validityMinutes}} मिनट के लिए वैध। इस कोड को किसी के साथ साझा न करें।'
    },
    maxLength: 160,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============================================================================
// SMS SERVICE CLASS
// ============================================================================

export class SMSService {
  private messages: Map<string, SMSMessage> = new Map();
  private templates: Map<string, SMSTemplate> = new Map();
  private emergencyContacts: Map<string, EmergencyContact> = new Map();
  private broadcasts: Map<string, EmergencyBroadcastSMS> = new Map();
  private deliveryQueue: string[] = [];
  private isProcessingQueue = false;

  constructor() {
    this.initializeMockData();
    this.startDeliveryProcessor();
  }

  // ========================================================================
  // CORE SMS METHODS
  // ========================================================================

  /**
   * Send single SMS message
   */
  async sendSMS(
    phoneNumber: string,
    message: string,
    options: {
      recipientId?: string;
      priority?: 'emergency' | 'high' | 'normal' | 'low';
      messageType?: 'alert' | 'emergency' | 'broadcast' | 'notification' | 'otp';
      language?: string;
      scheduledAt?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<SMSMessage> {
    try {
      const messageId = this.generateMessageId();
      const now = new Date().toISOString();

      const smsMessage: SMSMessage = {
        id: messageId,
        recipientId: options.recipientId || 'unknown',
        phoneNumber: this.normalizePhoneNumber(phoneNumber),
        message: message.substring(0, 160), // Truncate to SMS limit
        priority: options.priority || 'normal',
        messageType: options.messageType || 'notification',
        status: options.scheduledAt ? 'pending' : 'pending',
        language: options.language || 'en',
        scheduledAt: options.scheduledAt,
        attempts: 0,
        maxAttempts: 3,
        metadata: options.metadata,
        createdAt: now,
        updatedAt: now
      };

      // Store message
      this.messages.set(messageId, smsMessage);

      // Add to delivery queue if not scheduled
      if (!options.scheduledAt) {
        this.deliveryQueue.push(messageId);
      }

      console.log(`[SMS] Queued message ${messageId} to ${phoneNumber}`);
      return smsMessage;

    } catch (error: any) {
      console.error('[SMS] Failed to send SMS:', error);
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }

  /**
   * Send SMS using template
   */
  async sendSMSFromTemplate(
    templateId: string,
    phoneNumber: string,
    variables: Record<string, string>,
    options: {
      recipientId?: string;
      language?: string;
      scheduledAt?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<SMSMessage> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`SMS template ${templateId} not found`);
    }

    const language = options.language || 'en';
    const templateText = template.languages[language] || template.template;
    
    // Replace variables in template
    let message = templateText;
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      message = message.replace(new RegExp(placeholder, 'g'), value);
    });

    return this.sendSMS(phoneNumber, message, {
      ...options,
      priority: template.priority,
      messageType: template.type,
      language
    });
  }

  /**
   * Send bulk SMS messages
   */
  async sendBulkSMS(request: BulkSMSRequest): Promise<SMSDeliveryReport> {
    try {
      console.log(`[SMS] Starting bulk SMS to ${request.recipients.length} recipients`);

      const startTime = Date.now();
      const results = {
        totalMessages: request.recipients.length,
        sentCount: 0,
        deliveredCount: 0,
        failedCount: 0,
        pendingCount: 0,
        deliveryRate: 0,
        averageDeliveryTime: 0,
        costAnalysis: {
          totalCost: 0,
          costPerMessage: 0.05, // $0.05 per SMS
          currency: 'USD'
        },
        failureReasons: {} as Record<string, number>,
        byCountry: {} as Record<string, { sent: number; delivered: number; failed: number; cost: number }>
      };

      // Send messages to all recipients
      const promises = request.recipients.map(async (recipient) => {
        try {
          const message = await this.sendSMSFromTemplate(
            request.templateId,
            recipient.phoneNumber,
            recipient.variables || {},
            {
              recipientId: recipient.recipientId,
              language: request.language,
              scheduledAt: request.scheduledAt,
              metadata: request.metadata
            }
          );

          if (message.status === 'sent' || message.status === 'pending') {
            results.sentCount++;
          } else {
            results.failedCount++;
          }

          return message;
        } catch (error: any) {
          results.failedCount++;
          const reason = error.message || 'Unknown error';
          results.failureReasons[reason] = (results.failureReasons[reason] || 0) + 1;
          return null;
        }
      });

      await Promise.allSettled(promises);

      // Calculate metrics
      results.deliveryRate = results.sentCount / results.totalMessages;
      results.pendingCount = results.totalMessages - results.sentCount - results.failedCount;
      results.costAnalysis.totalCost = results.sentCount * results.costAnalysis.costPerMessage;
      results.averageDeliveryTime = (Date.now() - startTime) / 1000;

      console.log(`[SMS] Bulk SMS completed: ${results.sentCount}/${results.totalMessages} sent`);
      return results;

    } catch (error: any) {
      console.error('[SMS] Bulk SMS failed:', error);
      throw error;
    }
  }

  /**
   * Send emergency alert to emergency contacts
   */
  async sendEmergencyAlert(
    touristId: string,
    templateId: string,
    variables: Record<string, string>,
    options: {
      includePrimary?: boolean;
      includeSecondary?: boolean;
      language?: string;
    } = {}
  ): Promise<SMSMessage[]> {
    try {
      console.log(`[SMS] Sending emergency alert for tourist ${touristId}`);

      // Get emergency contacts for tourist
      const contacts = Array.from(this.emergencyContacts.values()).filter(
        contact => contact.touristId === touristId && contact.isActive
      );

      if (contacts.length === 0) {
        throw new Error(`No emergency contacts found for tourist ${touristId}`);
      }

      // Filter by primary/secondary preference
      const filteredContacts = contacts.filter(contact => {
        if (options.includePrimary === false && contact.isPrimary) return false;
        if (options.includeSecondary === false && !contact.isPrimary) return false;
        return true;
      });

      if (filteredContacts.length === 0) {
        throw new Error('No emergency contacts match the specified criteria');
      }

      // Send SMS to all filtered contacts
      const promises = filteredContacts.map(contact =>
        this.sendSMSFromTemplate(templateId, contact.phoneNumber, variables, {
          recipientId: contact.id,
          language: options.language || contact.language,
          metadata: {
            touristId,
            contactType: 'emergency_contact',
            contactId: contact.id,
            isPrimary: contact.isPrimary,
            relationship: contact.relationship
          }
        })
      );

      const results = await Promise.allSettled(promises);
      const sentMessages = results
        .filter((result): result is PromiseFulfilledResult<SMSMessage> => result.status === 'fulfilled')
        .map(result => result.value);

      console.log(`[SMS] Emergency alert sent to ${sentMessages.length}/${filteredContacts.length} contacts`);
      return sentMessages;

    } catch (error: any) {
      console.error('[SMS] Emergency alert failed:', error);
      throw error;
    }
  }

  /**
   * Send emergency broadcast to multiple recipients
   */
  async sendEmergencyBroadcast(broadcast: Omit<EmergencyBroadcastSMS, 'id' | 'deliveryStats' | 'createdAt' | 'updatedAt'>): Promise<EmergencyBroadcastSMS> {
    try {
      const broadcastId = this.generateBroadcastId();
      const now = new Date().toISOString();

      console.log(`[SMS] Creating emergency broadcast ${broadcastId}`);

      const broadcastRecord: EmergencyBroadcastSMS = {
        ...broadcast,
        id: broadcastId,
        deliveryStats: {
          totalMessages: 0,
          sentCount: 0,
          deliveredCount: 0,
          failedCount: 0,
          pendingCount: 0,
          deliveryRate: 0,
          averageDeliveryTime: 0,
          costAnalysis: {
            totalCost: 0,
            costPerMessage: 0.05,
            currency: 'USD'
          },
          failureReasons: {},
          byCountry: {}
        },
        createdAt: now,
        updatedAt: now
      };

      // Store broadcast
      this.broadcasts.set(broadcastId, broadcastRecord);

      // Get target recipients
      const recipients = await this.getTargetRecipients(broadcast.targetAudience);
      console.log(`[SMS] Found ${recipients.length} target recipients`);

      if (recipients.length === 0) {
        throw new Error('No recipients found for broadcast criteria');
      }

      // Prepare bulk SMS request
      const bulkRequest: BulkSMSRequest = {
        recipients: recipients.map(recipient => ({
          phoneNumber: recipient.phoneNumber,
          recipientId: recipient.id,
          variables: {
            recipientName: recipient.name || 'Valued Tourist',
            broadcastId: broadcastId
          }
        })),
        templateId: 'template_emergency_broadcast', // Would use a broadcast template
        priority: broadcast.priority,
        scheduledAt: broadcast.scheduledAt,
        language: broadcast.languages[0] || 'en',
        metadata: {
          broadcastId,
          broadcastType: 'emergency',
          targetAudience: broadcast.targetAudience
        }
      };

      // Send bulk SMS
      const deliveryStats = await this.sendBulkSMS(bulkRequest);

      // Update broadcast with delivery stats
      broadcastRecord.deliveryStats = deliveryStats;
      broadcastRecord.status = 'sent';
      broadcastRecord.updatedAt = new Date().toISOString();

      this.broadcasts.set(broadcastId, broadcastRecord);

      console.log(`[SMS] Emergency broadcast ${broadcastId} completed`);
      return broadcastRecord;

    } catch (error: any) {
      console.error('[SMS] Emergency broadcast failed:', error);
      throw error;
    }
  }

  // ========================================================================
  // DELIVERY & STATUS TRACKING
  // ========================================================================

  /**
   * Process SMS delivery queue
   */
  private async processDeliveryQueue(): Promise<void> {
    if (this.isProcessingQueue || this.deliveryQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`[SMS] Processing ${this.deliveryQueue.length} messages in delivery queue`);

    try {
      // Process messages in batches
      const batchSize = 10;
      const batch = this.deliveryQueue.splice(0, batchSize);

      for (const messageId of batch) {
        const message = this.messages.get(messageId);
        if (!message) continue;

        try {
          await this.deliverMessage(message);
        } catch (error: any) {
          console.error(`[SMS] Failed to deliver message ${messageId}:`, error);
          await this.handleDeliveryFailure(message, error.message);
        }
      }

    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Simulate message delivery
   */
  private async deliverMessage(message: SMSMessage): Promise<void> {
    console.log(`[SMS] Delivering message ${message.id} to ${message.phoneNumber}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));

    // Simulate delivery success/failure (95% success rate)
    const deliverySuccess = Math.random() > 0.05;

    if (deliverySuccess) {
      // Update message status
      message.status = 'sent';
      message.sentAt = new Date().toISOString();
      message.attempts++;

      // Simulate delivery confirmation after delay
      setTimeout(() => {
        message.status = 'delivered';
        message.deliveredAt = new Date().toISOString();
        this.messages.set(message.id, message);
        console.log(`[SMS] Message ${message.id} delivered successfully`);
      }, 1000 + Math.random() * 3000);

    } else {
      throw new Error('SMS delivery failed - network error');
    }

    // Update message
    this.messages.set(message.id, message);
  }

  /**
   * Handle delivery failure
   */
  private async handleDeliveryFailure(message: SMSMessage, error: string): Promise<void> {
    message.attempts++;
    message.error = error;
    message.updatedAt = new Date().toISOString();

    if (message.attempts >= message.maxAttempts) {
      message.status = 'failed';
      message.failedAt = new Date().toISOString();
      console.log(`[SMS] Message ${message.id} failed permanently after ${message.attempts} attempts`);
    } else {
      // Retry after delay
      message.status = 'pending';
      setTimeout(() => {
        this.deliveryQueue.push(message.id);
      }, 5000 * message.attempts); // Exponential backoff
      console.log(`[SMS] Message ${message.id} scheduled for retry (attempt ${message.attempts + 1})`);
    }

    this.messages.set(message.id, message);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Normalize phone number format
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let normalized = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    return normalized;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique broadcast ID
   */
  private generateBroadcastId(): string {
    return `broadcast_sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get target recipients for broadcast
   */
  private async getTargetRecipients(targetAudience: any): Promise<Array<{ id: string; phoneNumber: string; name?: string }>> {
    // Mock implementation - would query database in production
    const mockRecipients = [
      { id: 'T001', phoneNumber: '+1234567890', name: 'John Doe' },
      { id: 'T002', phoneNumber: '+1234567891', name: 'Jane Smith' },
      { id: 'A001', phoneNumber: '+1987654321', name: 'Officer Johnson' },
      { id: 'A002', phoneNumber: '+1987654322', name: 'Sergeant Brown' }
    ];

    // Filter based on target audience type
    switch (targetAudience.type) {
      case 'tourists':
        return mockRecipients.filter(r => r.id.startsWith('T'));
      case 'authorities':
        return mockRecipients.filter(r => r.id.startsWith('A'));
      case 'emergency_contacts':
        return Array.from(this.emergencyContacts.values()).map(contact => ({
          id: contact.id,
          phoneNumber: contact.phoneNumber,
          name: contact.name
        }));
      case 'all':
      default:
        return mockRecipients;
    }
  }

  /**
   * Start delivery processor
   */
  private startDeliveryProcessor(): void {
    setInterval(() => {
      this.processDeliveryQueue();
    }, 1000); // Process every second
  }

  /**
   * Initialize mock data
   */
  private initializeMockData(): void {
    // Load emergency contacts
    mockEmergencyContacts.forEach(contact => {
      this.emergencyContacts.set(contact.id, contact);
    });

    // Load SMS templates
    mockSMSTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });

    console.log('[SMS] Service initialized with mock data');
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  /**
   * Get SMS delivery statistics
   */
  getDeliveryStats(dateRange?: { start: string; end: string }): SMSDeliveryReport {
    const messages = Array.from(this.messages.values());
    
    const total = messages.length;
    const sent = messages.filter(m => m.status === 'sent' || m.status === 'delivered').length;
    const delivered = messages.filter(m => m.status === 'delivered').length;
    const failed = messages.filter(m => m.status === 'failed').length;
    const pending = messages.filter(m => m.status === 'pending').length;

    return {
      totalMessages: total,
      sentCount: sent,
      deliveredCount: delivered,
      failedCount: failed,
      pendingCount: pending,
      deliveryRate: total > 0 ? delivered / total : 0,
      averageDeliveryTime: 2.5, // Mock average
      costAnalysis: {
        totalCost: sent * 0.05,
        costPerMessage: 0.05,
        currency: 'USD'
      },
      failureReasons: {
        'Network error': failed * 0.6,
        'Invalid number': failed * 0.3,
        'Service unavailable': failed * 0.1
      },
      byCountry: {
        'US': { sent: sent * 0.4, delivered: delivered * 0.4, failed: failed * 0.4, cost: sent * 0.4 * 0.05 },
        'UK': { sent: sent * 0.3, delivered: delivered * 0.3, failed: failed * 0.3, cost: sent * 0.3 * 0.06 },
        'IN': { sent: sent * 0.3, delivered: delivered * 0.3, failed: failed * 0.3, cost: sent * 0.3 * 0.03 }
      }
    };
  }

  /**
   * Get message by ID
   */
  getMessage(messageId: string): SMSMessage | undefined {
    return this.messages.get(messageId);
  }

  /**
   * Get all messages for a recipient
   */
  getMessagesByRecipient(recipientId: string): SMSMessage[] {
    return Array.from(this.messages.values()).filter(m => m.recipientId === recipientId);
  }

  /**
   * Get emergency contacts for tourist
   */
  getEmergencyContacts(touristId: string): EmergencyContact[] {
    return Array.from(this.emergencyContacts.values()).filter(
      contact => contact.touristId === touristId && contact.isActive
    );
  }

  /**
   * Add emergency contact
   */
  async addEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmergencyContact> {
    const contactId = `ec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newContact: EmergencyContact = {
      ...contact,
      id: contactId,
      createdAt: now,
      updatedAt: now
    };

    this.emergencyContacts.set(contactId, newContact);
    return newContact;
  }

  /**
   * Update emergency contact
   */
  async updateEmergencyContact(contactId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const contact = this.emergencyContacts.get(contactId);
    if (!contact) {
      throw new Error(`Emergency contact ${contactId} not found`);
    }

    const updatedContact = {
      ...contact,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.emergencyContacts.set(contactId, updatedContact);
    return updatedContact;
  }

  /**
   * Get SMS templates
   */
  getTemplates(): SMSTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.isActive);
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): SMSTemplate | undefined {
    return this.templates.get(templateId);
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const smsService = new SMSService();
export default smsService;