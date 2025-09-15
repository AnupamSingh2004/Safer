'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  FileText,
  ExternalLink,
  Search,
  Filter,
  Plus,
  MessageSquare,
  Headphones,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Star,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  X,
  Edit,
  Trash2
} from 'lucide-react';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

interface ContactInfo {
  type: 'phone' | 'email' | 'address' | 'hours';
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  description?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  content: string;
  author: string;
  isStaff: boolean;
  createdAt: string;
  attachments?: string[];
}

interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'medical' | 'fire' | 'disaster' | 'tourism';
  location: string;
  available24h: boolean;
  description: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const contactInfo: ContactInfo[] = [
  {
    type: 'phone',
    label: 'Emergency Hotline',
    value: '+91-1800-XXX-XXXX',
    icon: Phone,
    description: '24/7 emergency support for tourists in distress'
  },
  {
    type: 'phone',
    label: 'Technical Support',
    value: '+91-XXX-XXX-XXXX',
    icon: Headphones,
    description: 'Monday to Friday, 9 AM to 6 PM IST'
  },
  {
    type: 'email',
    label: 'General Inquiries',
    value: 'support@touristsafety.gov.in',
    icon: Mail,
    description: 'General questions and information requests'
  },
  {
    type: 'email',
    label: 'Technical Issues',
    value: 'tech@touristsafety.gov.in',
    icon: MessageCircle,
    description: 'Technical support and bug reports'
  },
  {
    type: 'address',
    label: 'Head Office',
    value: 'Ministry of Tourism, Transport Bhawan, New Delhi - 110001',
    icon: MapPin,
    description: 'Main administrative office'
  },
  {
    type: 'hours',
    label: 'Office Hours',
    value: 'Monday to Friday: 9:00 AM - 6:00 PM IST',
    icon: Clock,
    description: 'Regular business hours for non-emergency support'
  }
];

const supportCategories: SupportCategory[] = [
  {
    id: 'technical',
    name: 'Technical Issues',
    description: 'App bugs, login problems, system errors',
    icon: MessageCircle,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'account',
    name: 'Account & Access',
    description: 'Password reset, permissions, user management',
    icon: User,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'safety',
    name: 'Safety & Emergency',
    description: 'Safety alerts, emergency procedures, incident reporting',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'New feature suggestions and improvements',
    icon: Plus,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'training',
    name: 'Training & Support',
    description: 'User training, documentation, how-to guides',
    icon: FileText,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'General questions and other inquiries',
    icon: MessageSquare,
    color: 'bg-gray-100 text-gray-600'
  }
];

const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'National Emergency Response',
    phone: '112',
    type: 'police',
    location: 'Pan India',
    available24h: true,
    description: 'Single emergency number for all emergency services'
  },
  {
    id: '2',
    name: 'Tourist Helpline',
    phone: '1363',
    type: 'tourism',
    location: 'Pan India',
    available24h: true,
    description: '24x7 multilingual tourist helpline'
  },
  {
    id: '3',
    name: 'Medical Emergency',
    phone: '108',
    type: 'medical',
    location: 'Pan India',
    available24h: true,
    description: 'Free emergency medical services'
  },
  {
    id: '4',
    name: 'Fire Department',
    phone: '101',
    type: 'fire',
    location: 'Pan India',
    available24h: true,
    description: 'Fire and rescue services'
  },
  {
    id: '5',
    name: 'Disaster Management',
    phone: '108',
    type: 'disaster',
    location: 'Pan India',
    available24h: true,
    description: 'Natural disaster response and coordination'
  }
];

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to create safety alerts',
    description: 'I am getting an error when trying to create a new safety alert. The form submits but shows a server error.',
    category: 'technical',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    assignedTo: 'John Smith',
    responses: [
      {
        id: 'R1',
        content: 'Thank you for reporting this issue. We are investigating the alert creation error. Could you please provide more details about the error message you are seeing?',
        author: 'Support Team',
        isStaff: true,
        createdAt: '2024-01-20T11:00:00Z'
      },
      {
        id: 'R2',
        content: 'The error message says "Internal server error 500" and it happens every time I try to submit the alert form.',
        author: 'Current User',
        isStaff: false,
        createdAt: '2024-01-20T11:30:00Z'
      }
    ]
  },
  {
    id: 'TKT-002',
    subject: 'Request for training materials',
    description: 'We need training materials for new field operators on how to use the tourist tracking system.',
    category: 'training',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-01-19T15:20:00Z',
    updatedAt: '2024-01-19T15:20:00Z',
    responses: []
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    attachments: []
  });

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call
      console.log('Submitting contact form:', contactForm);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Thank you for your message! We will get back to you within 24 hours.');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
        attachments: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call
      const newTicket: SupportTicket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: ticketForm.subject,
        description: ticketForm.description,
        category: ticketForm.category,
        priority: ticketForm.priority as any,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
      };
      
      setTickets([newTicket, ...tickets]);
      setShowNewTicketForm(false);
      setTicketForm({
        subject: '',
        category: '',
        priority: 'medium',
        description: ''
      });
      
      alert('Support ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ============================================================================
  // COMPONENTS
  // ============================================================================

  const ContactTab = () => (
    <div className="space-y-8">
      {/* Emergency Contacts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-900">Emergency Contacts</h2>
        </div>
        <p className="text-red-700 mb-6">
          For immediate assistance in emergency situations, please contact these numbers:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="bg-white p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                {contact.available24h && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    24/7
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-red-600 mb-2">{contact.phone}</p>
              <p className="text-sm text-gray-600 mb-1">{contact.location}</p>
              <p className="text-xs text-gray-500">{contact.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
          
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{info.label}</h3>
                    <p className="text-gray-700 mt-1">{info.value}</p>
                    {info.description && (
                      <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social Media */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: 'text-blue-600', href: '#' },
                { icon: Twitter, color: 'text-blue-400', href: '#' },
                { icon: Linkedin, color: 'text-blue-700', href: '#' },
                { icon: Youtube, color: 'text-red-600', href: '#' }
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 ${social.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {supportCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please describe your inquiry or issue in detail..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const SupportTab = () => (
    <div className="space-y-6">
      {/* Support Categories */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">How can we help you?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-all"
                onClick={() => {
                  setTicketForm({ ...ticketForm, category: category.id });
                  setShowNewTicketForm(true);
                }}
              >
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tickets Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
          <p className="text-gray-600">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">Create your first support ticket to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-gray-900">#{ticket.id}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                        ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Create Support Ticket</h2>
                  <button
                    onClick={() => setShowNewTicketForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {supportCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed description of your issue, including steps to reproduce if applicable..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewTicketForm(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Creating...' : 'Create Ticket'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      #{selectedTicket.id} - {selectedTicket.subject}
                    </h2>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedTicket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        selectedTicket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        selectedTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedTicket.priority} priority
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                        selectedTicket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedTicket.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Original Message */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Original Request</span>
                      <span className="text-sm text-gray-500">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{selectedTicket.description}</p>
                  </div>

                  {/* Responses */}
                  {selectedTicket.responses.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Responses</h3>
                      {selectedTicket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-4 rounded-lg ${
                            response.isStaff ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${
                              response.isStaff ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {response.author}
                              {response.isStaff && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  Staff
                                </span>
                              )}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{response.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Response */}
                  {selectedTicket.status !== 'closed' && (
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-gray-900 mb-4">Add Response</h3>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Type your response..."
                      />
                      <div className="flex items-center justify-end space-x-4 mt-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Send className="w-4 h-4" />
                          <span>Send Response</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact & Support</h1>
          <p className="mt-2 text-gray-600">Get help and stay connected with our support team</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'contact', label: 'Contact Us', icon: MessageCircle },
                { id: 'support', label: 'Support Tickets', icon: FileText }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'contact' && <ContactTab />}
            {activeTab === 'support' && <SupportTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}