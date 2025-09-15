'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Download,
  ExternalLink,
  Star,
  ChevronRight,
  ArrowLeft,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Shield,
  Users,
  MapPin,
  BarChart3
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { ThemeToggle } from '@/components/theme/unified-theme-components';

const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using the Smart Tourist Safety System',
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-600',
      articles: [
        'How to register as a tourism operator',
        'Setting up your first safety zone',
        'Understanding the dashboard',
        'Tourist registration process'
      ]
    },
    {
      id: 'safety-features',
      title: 'Safety Features',
      description: 'Comprehensive guide to all safety monitoring tools',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      articles: [
        'Emergency alert system',
        'Real-time location tracking',
        'Geo-fencing setup',
        'Incident reporting'
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Managing tourists, operators, and emergency contacts',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      articles: [
        'Adding new users',
        'Role management',
        'Permission settings',
        'User verification process'
      ]
    },
    {
      id: 'location-services',
      title: 'Location Services',
      description: 'GPS tracking, mapping, and location-based alerts',
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      articles: [
        'GPS tracking setup',
        'Creating safety zones',
        'Location history',
        'Offline tracking'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'Understanding data insights and generating reports',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      articles: [
        'Dashboard analytics',
        'Custom reports',
        'Data export',
        'Performance metrics'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and their solutions',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      articles: [
        'Login problems',
        'GPS not working',
        'Notification issues',
        'Data sync problems'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      href: '/contact',
      color: 'bg-blue-500'
    },
    {
      title: 'Emergency Hotline',
      description: '24/7 emergency assistance',
      icon: Phone,
      href: 'tel:+91-1800-XXX-XXXX',
      color: 'bg-red-500'
    },
    {
      title: 'User Manual',
      description: 'Download complete documentation',
      icon: Download,
      href: '#',
      color: 'bg-green-500'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      href: '#',
      color: 'bg-purple-500'
    }
  ];

  const popularArticles = [
    {
      title: 'How to set up emergency alerts',
      views: 1250,
      rating: 4.8,
      readTime: '5 min read'
    },
    {
      title: 'Tourist registration best practices',
      views: 980,
      rating: 4.9,
      readTime: '7 min read'
    },
    {
      title: 'Understanding location tracking',
      views: 875,
      rating: 4.7,
      readTime: '6 min read'
    },
    {
      title: 'Troubleshooting GPS issues',
      views: 720,
      rating: 4.6,
      readTime: '4 min read'
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    searchQuery === '' || 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => article.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      
      {/* Header Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 shadow-lg mb-8">
              <HelpCircle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Support Center</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-6">
              How can we help you?
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Find answers to your questions, learn how to use our platform, or get in touch with our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, features, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Theme Switcher in top-right corner */}
            <div className="absolute top-8 right-8">
              <ThemeToggle variant="button" size="md" showLabel />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isExternal = action.href.startsWith('http') || action.href.startsWith('tel:');
              
              const content = (
                <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${action.color} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium mr-1">Learn more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );

              if (isExternal) {
                return (
                  <a key={index} href={action.href} className="block">
                    {content}
                  </a>
                );
              }

              return (
                <Link key={index} href={action.href} className="block">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Help Topics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore our comprehensive guides organized by category to find exactly what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>

                  {selectedCategory === category.id && (
                    <div className="mt-4 space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {article}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium mr-1">
                      {selectedCategory === category.id ? 'Collapse' : 'View articles'}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Most viewed and highest rated help articles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.views} views
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {article.rating}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-8" />
          
          <h2 className="text-3xl font-bold text-white mb-6">
            Still need help?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
            
            <a
              href="tel:+91-1800-XXX-XXXX"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Emergency Hotline
            </a>
          </div>
          
          <div className="mt-8 text-blue-100">
            <p className="text-sm">
              Emergency Hotline: 24/7 • Support Team: Mon-Fri 9AM-6PM IST
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Smart Tourist Safety</h3>
                  <p className="text-sm text-gray-400">Government of India</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                24/7 support for tourist safety monitoring system
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91-1800-XXX-XXXX</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@touristsafety.gov.in</span>
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>24/7 Emergency Support</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 Government of India. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default SupportPage;