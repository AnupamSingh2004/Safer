/**
 * Smart Tourist Safety System - Real-time Messaging Component
 * Chat interface for tourist-officer communication and emergency messaging
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Image,
  File,
  Mic,
  MicOff,
  Camera,
  X,
  User,
  Shield,
  Heart,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'tourist' | 'officer' | 'admin' | 'emergency';
  content: string;
  type: 'text' | 'image' | 'file' | 'location' | 'alert' | 'system';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isUrgent?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  alertType?: 'emergency' | 'warning' | 'info';
}

interface ChatConversation {
  id: string;
  type: 'direct' | 'group' | 'emergency';
  name: string;
  participants: Array<{
    id: string;
    name: string;
    role: 'tourist' | 'officer' | 'admin' | 'emergency';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RealTimeMessagingProps {
  selectedConversationId?: string;
  onConversationSelect?: (conversation: ChatConversation) => void;
  onEmergencyCall?: (participantId: string) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-001',
    type: 'direct',
    name: 'Tourist: Raj Kumar',
    participants: [
      {
        id: 'tourist-001',
        name: 'Raj Kumar',
        role: 'tourist',
        isOnline: true,
      },
      {
        id: 'officer-001',
        name: 'Officer Priya Sharma',
        role: 'officer',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-001',
      senderId: 'tourist-001',
      senderName: 'Raj Kumar',
      senderRole: 'tourist',
      content: 'I need help, I think I\'m lost near Red Fort',
      type: 'text',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      status: 'delivered',
      isUrgent: true,
    },
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'conv-002',
    type: 'emergency',
    name: 'Emergency: Medical Alert',
    participants: [
      {
        id: 'tourist-002',
        name: 'Priya Sharma',
        role: 'tourist',
        isOnline: false,
        lastSeen: '2024-01-16T14:30:00Z',
      },
      {
        id: 'officer-002',
        name: 'Dr. Amit Singh',
        role: 'officer',
        isOnline: true,
      },
      {
        id: 'emergency-001',
        name: 'Emergency Dispatcher',
        role: 'emergency',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-002',
      senderId: 'emergency-001',
      senderName: 'Emergency Dispatcher',
      senderRole: 'emergency',
      content: 'Ambulance dispatched to your location. ETA: 8 minutes',
      type: 'alert',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      status: 'read',
      alertType: 'emergency',
    },
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    createdAt: '2024-01-16T14:25:00Z',
    updatedAt: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 'conv-003',
    type: 'group',
    name: 'India Gate Tour Group',
    participants: [
      {
        id: 'tourist-003',
        name: 'Alex Johnson',
        role: 'tourist',
        isOnline: true,
      },
      {
        id: 'tourist-004',
        name: 'Sarah Wilson',
        role: 'tourist',
        isOnline: false,
        lastSeen: '2024-01-16T13:45:00Z',
      },
      {
        id: 'officer-003',
        name: 'Guide Ramesh',
        role: 'officer',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-003',
      senderId: 'officer-003',
      senderName: 'Guide Ramesh',
      senderRole: 'officer',
      content: 'Next stop: Humayun\'s Tomb. Meet at the main entrance in 15 minutes.',
      type: 'text',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: 'read',
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-101',
    senderId: 'tourist-001',
    senderName: 'Raj Kumar',
    senderRole: 'tourist',
    content: 'Hello, I just arrived at India Gate',
    type: 'text',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'read',
  },
  {
    id: 'msg-102',
    senderId: 'officer-001',
    senderName: 'Officer Priya Sharma',
    senderRole: 'officer',
    content: 'Welcome to Delhi! I\'m your assigned safety officer. How can I help you today?',
    type: 'text',
    timestamp: new Date(Date.now() - 1620000).toISOString(),
    status: 'read',
  },
  {
    id: 'msg-103',
    senderId: 'tourist-001',
    senderName: 'Raj Kumar',
    senderRole: 'tourist',
    content: 'Thank you! I\'m planning to visit Red Fort next. Is it safe?',
    type: 'text',
    timestamp: new Date(Date.now() - 1440000).toISOString(),
    status: 'read',
  },
  {
    id: 'msg-104',
    senderId: 'officer-001',
    senderName: 'Officer Priya Sharma',
    senderRole: 'officer',
    content: 'Yes, Red Fort is completely safe. Here\'s your current location for reference.',
    type: 'text',
    timestamp: new Date(Date.now() - 1380000).toISOString(),
    status: 'read',
  },
  {
    id: 'msg-105',
    senderId: 'officer-001',
    senderName: 'Officer Priya Sharma',
    senderRole: 'officer',
    content: '',
    type: 'location',
    timestamp: new Date(Date.now() - 1320000).toISOString(),
    status: 'read',
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'India Gate, New Delhi, Delhi 110003',
    },
  },
  {
    id: 'msg-106',
    senderId: 'tourist-001',
    senderName: 'Raj Kumar',
    senderRole: 'tourist',
    content: 'I need help, I think I\'m lost near Red Fort',
    type: 'text',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    status: 'delivered',
    isUrgent: true,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RealTimeMessaging({
  selectedConversationId,
  onConversationSelect,
  onEmergencyCall,
  className,
}: RealTimeMessagingProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(
    conversations.find(c => c.id === selectedConversationId) || conversations[0]
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get messages for selected conversation
  const conversationMessages = messages.filter(msg => 
    selectedConversation?.participants.some(p => p.id === msg.senderId)
  );

  // Handle conversation selection
  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    onConversationSelect?.(conversation);
    
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'current-user',
      senderName: user?.email || 'Current User',
      senderRole: 'officer', // Assuming current user is officer
      content: messageInput.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // Simulate message sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
        : conv
    ));
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file attachment
  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  // Handle emergency call
  const handleEmergencyCall = () => {
    if (selectedConversation && onEmergencyCall) {
      const otherParticipant = selectedConversation.participants.find(p => p.id !== user?.id);
      if (otherParticipant) {
        onEmergencyCall(otherParticipant.id);
      }
    }
  };

  // Format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'tourist': return User;
      case 'officer': return Shield;
      case 'emergency': return Heart;
      case 'admin': return Star;
      default: return User;
    }
  };

  // Get message status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return Clock;
      case 'sent': return CheckCircle;
      case 'delivered': return CheckCircle;
      case 'read': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className={cn('flex h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?.id === conversation.id;
            const RoleIcon = getRoleIcon(conversation.participants[0]?.role || 'tourist');
            
            return (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={cn(
                  'p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                  isSelected && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      conversation.type === 'emergency' ? 'bg-red-100 dark:bg-red-900/20' :
                      conversation.type === 'group' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    )}>
                      <RoleIcon className={cn(
                        'h-5 w-5',
                        conversation.type === 'emergency' ? 'text-red-600' :
                        conversation.type === 'group' ? 'text-green-600' :
                        'text-blue-600'
                      )} />
                    </div>
                    {conversation.participants.some(p => p.isOnline) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        'text-sm font-medium truncate',
                        isSelected ? 'text-blue-900 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      )}>
                        {conversation.name}
                        {conversation.isPinned && (
                          <Star className="inline-block h-3 w-3 ml-1 text-yellow-500" />
                        )}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    {conversation.lastMessage && (
                      <div className="flex items-center mt-1">
                        <p className={cn(
                          'text-sm truncate',
                          conversation.lastMessage.isUrgent ? 'text-red-600 font-medium' :
                          conversation.unreadCount > 0 ? 'text-gray-900 dark:text-white font-medium' :
                          'text-gray-600 dark:text-gray-400'
                        )}>
                          {conversation.lastMessage.isUrgent && (
                            <AlertTriangle className="inline-block h-3 w-3 mr-1" />
                          )}
                          {conversation.lastMessage.type === 'location' ? '📍 Location shared' :
                           conversation.lastMessage.type === 'image' ? '📷 Image' :
                           conversation.lastMessage.type === 'file' ? '📎 File' :
                           conversation.lastMessage.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    selectedConversation.type === 'emergency' ? 'bg-red-100 dark:bg-red-900/20' :
                    selectedConversation.type === 'group' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  )}>
                    {selectedConversation.type === 'emergency' ? (
                      <Heart className="h-4 w-4 text-red-600" />
                    ) : selectedConversation.type === 'group' ? (
                      <User className="h-4 w-4 text-green-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedConversation.participants.length} participants
                      {selectedConversation.participants.some(p => p.isOnline) && (
                        <span className="ml-2 text-green-600">• Online</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedConversation.type === 'emergency' && (
                    <button
                      onClick={handleEmergencyCall}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                const RoleIcon = getRoleIcon(message.senderRole);
                const StatusIcon = getStatusIcon(message.status);
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      'flex max-w-xs lg:max-w-md',
                      isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                    )}>
                      {!isOwnMessage && (
                        <div className="flex-shrink-0 mr-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            message.senderRole === 'emergency' ? 'bg-red-100 dark:bg-red-900/20' :
                            message.senderRole === 'tourist' ? 'bg-blue-100 dark:bg-blue-900/20' :
                            'bg-gray-100 dark:bg-gray-700'
                          )}>
                            <RoleIcon className={cn(
                              'h-4 w-4',
                              message.senderRole === 'emergency' ? 'text-red-600' :
                              message.senderRole === 'tourist' ? 'text-blue-600' :
                              'text-gray-600'
                            )} />
                          </div>
                        </div>
                      )}
                      
                      <div className={cn(
                        'rounded-lg px-4 py-2',
                        isOwnMessage 
                          ? 'bg-blue-600 text-white' 
                          : message.isUrgent
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      )}>
                        {!isOwnMessage && (
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium">
                              {message.senderName}
                            </span>
                            {message.isUrgent && (
                              <AlertTriangle className="h-3 w-3 ml-1 text-red-600" />
                            )}
                          </div>
                        )}
                        
                        {message.type === 'location' ? (
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              Location shared
                            </div>
                            {message.location && (
                              <div className="text-xs opacity-75">
                                {message.location.address}
                              </div>
                            )}
                          </div>
                        ) : message.type === 'alert' ? (
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {message.alertType === 'emergency' ? 'Emergency Alert' : 'System Alert'}
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        
                        <div className={cn(
                          'flex items-center justify-end mt-2 space-x-1 text-xs',
                          isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                        )}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isOwnMessage && (
                            <StatusIcon className={cn(
                              'h-3 w-3',
                              message.status === 'read' ? 'text-blue-300' :
                              message.status === 'delivered' ? 'text-blue-300' :
                              message.status === 'sent' ? 'text-blue-400' :
                              'text-blue-500'
                            )} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-xs">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {attachmentPreview && (
                <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {attachmentPreview.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setAttachmentPreview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={handleFileAttachment}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                    <Camera className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={cn(
                    'p-2 rounded-full',
                    messageInput.trim()
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-gray-400 bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setAttachmentPreview(file);
          }
        }}
      />
    </div>
  );
}

export default RealTimeMessaging;
