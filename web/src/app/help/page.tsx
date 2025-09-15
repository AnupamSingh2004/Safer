'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  Video,
  Download,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Home,
  Lightbulb,
  Shield,
  Zap,
  Users,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/unified-theme-components';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  rating: number;
  helpful: number;
  type: 'article' | 'video' | 'pdf';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  downloadUrl?: string;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  articleCount: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  updatedAt: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using the Smart Tourist Safety System',
    icon: Lightbulb,
    color: 'text-blue-600 bg-blue-100',
    articleCount: 8
  },
  {
    id: 'user-management',
    name: 'User Management',
    description: 'Managing users, roles, and permissions',
    icon: Users,
    color: 'text-green-600 bg-green-100',
    articleCount: 12
  },
  {
    id: 'safety-features',
    name: 'Safety Features',
    description: 'Understanding and using safety monitoring tools',
    icon: Shield,
    color: 'text-red-600 bg-red-100',
    articleCount: 15
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Integrating with external systems and APIs',
    icon: Zap,
    color: 'text-purple-600 bg-purple-100',
    articleCount: 10
  },
  {
    id: 'system-administration',
    name: 'System Administration',
    description: 'Advanced configuration and administration',
    icon: Settings,
    color: 'text-orange-600 bg-orange-100',
    articleCount: 9
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: AlertTriangle,
    color: 'text-yellow-600 bg-yellow-100',
    articleCount: 6
  }
];

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Getting Started with Tourist Safety Dashboard',
    description: 'A comprehensive guide to understanding and navigating the main dashboard',
    content: `# Getting Started with Tourist Safety Dashboard

Welcome to the Smart Tourist Safety System! This guide will help you understand the main features and how to navigate the dashboard effectively.

## Overview
The Tourist Safety Dashboard is your central hub for monitoring and managing tourist safety across your designated areas. Here's what you'll find:

### Main Dashboard Features
- **Real-time Tourist Locations**: Track active tourists in your area
- **Safety Alerts**: Monitor active alerts and incidents
- **Weather Conditions**: Current weather affecting tourist safety
- **Emergency Contacts**: Quick access to emergency services

### Navigation
The sidebar provides access to all major sections:
- Dashboard: Overview of current status
- Tourists: Detailed tourist management
- Alerts: Safety alert management
- Reports: Analytics and reporting
- Settings: System configuration

### Quick Actions
Use the floating action button for:
- Creating new alerts
- Adding tourist information
- Emergency contacts

## Next Steps
1. Review the current dashboard status
2. Familiarize yourself with the alert system
3. Check tourist locations and status
4. Configure your notification preferences

For more detailed information, see our specific guides for each feature.`,
    category: 'getting-started',
    tags: ['dashboard', 'navigation', 'overview'],
    author: 'System Administrator',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-20',
    readTime: 5,
    views: 1250,
    rating: 4.8,
    helpful: 95,
    type: 'article',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Creating and Managing Safety Alerts',
    description: 'Learn how to create, update, and resolve safety alerts effectively',
    content: `# Creating and Managing Safety Alerts

Safety alerts are critical for maintaining tourist security. This guide covers the complete alert lifecycle.

## Creating Alerts
1. Click the "New Alert" button or use the floating action button
2. Select alert type (Weather, Security, Medical, Infrastructure)
3. Set severity level (Low, Medium, High, Critical)
4. Define affected area using the map interface
5. Add detailed description and instructions
6. Set expiration time if applicable

## Alert Types
- **Weather**: Storm warnings, extreme temperatures
- **Security**: Theft reports, unsafe areas
- **Medical**: Disease outbreaks, medical emergencies
- **Infrastructure**: Road closures, facility issues

## Managing Active Alerts
- Update alert status as situations evolve
- Add additional information or instructions
- Expand or reduce affected areas
- Escalate severity if needed

## Resolving Alerts
When an alert is no longer relevant:
1. Navigate to the alert details
2. Click "Resolve Alert"
3. Add resolution notes
4. Confirm resolution

Resolved alerts are archived for future reference and analysis.`,
    category: 'safety-features',
    tags: ['alerts', 'safety', 'emergency'],
    author: 'Safety Coordinator',
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-18',
    readTime: 8,
    views: 890,
    rating: 4.9,
    helpful: 87,
    type: 'article',
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'API Integration Guide',
    description: 'Complete guide for integrating external systems with our API',
    content: `# API Integration Guide

Our REST API allows external systems to integrate with the Tourist Safety System.

## Authentication
All API requests require authentication using JWT tokens:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
     https://api.touristsafety.com/v1/tourists
\`\`\`

## Available Endpoints

### Tourist Management
- GET /api/v1/tourists - List all tourists
- POST /api/v1/tourists - Create new tourist record
- PUT /api/v1/tourists/:id - Update tourist information
- DELETE /api/v1/tourists/:id - Remove tourist record

### Alert Management
- GET /api/v1/alerts - List active alerts
- POST /api/v1/alerts - Create new alert
- PUT /api/v1/alerts/:id - Update alert
- DELETE /api/v1/alerts/:id - Delete alert

### Location Tracking
- POST /api/v1/locations - Submit location update
- GET /api/v1/locations/:touristId - Get tourist location history

## Rate Limiting
- 1000 requests per hour for authenticated users
- 100 requests per hour for public endpoints

## Error Handling
The API returns standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Sample Integration
\`\`\`javascript
const response = await fetch('/api/v1/tourists', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    location: { lat: 40.7128, lng: -74.0060 }
  })
});
\`\`\``,
    category: 'api-integration',
    tags: ['api', 'integration', 'development'],
    author: 'Technical Lead',
    publishedAt: '2024-01-05',
    updatedAt: '2024-01-22',
    readTime: 12,
    views: 2100,
    rating: 4.7,
    helpful: 156,
    type: 'article',
    difficulty: 'advanced'
  }
];

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and you\'ll receive reset instructions.',
    category: 'account',
    helpful: 45,
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    question: 'Can I export tourist data for reports?',
    answer: 'Yes, you can export tourist data from the Reports section. Choose your date range and format (CSV, PDF, or Excel) and click Export.',
    category: 'reports',
    helpful: 32,
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    question: 'What should I do in case of an emergency alert?',
    answer: 'For emergency alerts: 1) Verify the alert details, 2) Contact local authorities if needed, 3) Notify affected tourists, 4) Update the alert with current status.',
    category: 'safety',
    helpful: 78,
    updatedAt: '2024-01-18'
  },
  {
    id: '4',
    question: 'How accurate is the location tracking?',
    answer: 'Location accuracy depends on GPS signal strength and device capabilities. Typically accurate within 3-5 meters in open areas, may vary in urban or covered areas.',
    category: 'technical',
    helpful: 56,
    updatedAt: '2024-01-12'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HelpPage() {
  const [activeView, setActiveView] = useState<'categories' | 'article' | 'search'>('categories');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [userRole] = useState('operator'); // Mock user role

  // ============================================================================
  // SEARCH AND FILTER
  // ============================================================================

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq =>
    searchQuery === '' ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveView('search');
    } else {
      setActiveView('categories');
    }
  };

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    setActiveView('article');
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveView('search');
  };

  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  const handleBackToCategories = () => {
    setActiveView('categories');
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedArticle(null);
  };

  // ============================================================================
  // COMPONENTS
  // ============================================================================

  const SearchBar = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search help articles, guides, and FAQs..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const CategoryView = () => (
    <div className="space-y-8">
      {/* Quick Start Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Start Guide</h2>
        <p className="text-gray-600 mb-4">New to the system? Start here to get up and running quickly.</p>
        <button 
          onClick={() => handleArticleClick(helpArticles[0])}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Get Started
        </button>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{category.articleCount} articles</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Featured Articles */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpArticles.slice(0, 4).map((article) => (
            <div 
              key={article.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
              onClick={() => handleArticleClick(article)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {article.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                  {article.type === 'pdf' && <FileText className="w-4 h-4 text-blue-500" />}
                  {article.type === 'article' && <BookOpen className="w-4 h-4 text-green-500" />}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {article.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime} min</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{article.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{article.rating}</span>
                </div>
                <span className="text-xs text-gray-500">{article.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white rounded-lg border border-gray-200">
          {faqs.slice(0, 4).map((faq, index) => (
            <div key={faq.id} className={`p-4 ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFAQs.has(faq.id) ? 
                  <ChevronDown className="w-5 h-5 text-gray-400" /> :
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                }
              </button>
              <AnimatePresence>
                {expandedFAQs.has(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-600">{faq.answer}</p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-green-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({faq.helpful})</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-red-600">
                        <ThumbsDown className="w-4 h-4" />
                        <span>Not helpful</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SearchView = () => (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button onClick={handleBackToCategories} className="hover:text-blue-600">
          Help
        </button>
        <ChevronRight className="w-4 h-4" />
        {selectedCategory && (
          <>
            <span>{helpCategories.find(c => c.id === selectedCategory)?.name || 'Search Results'}</span>
          </>
        )}
        {searchQuery && !selectedCategory && (
          <span>Search: "{searchQuery}"</span>
        )}
      </div>

      {/* Articles */}
      {filteredArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Articles {filteredArticles.length > 0 && `(${filteredArticles.length})`}
          </h2>
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {article.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                    {article.type === 'pdf' && <FileText className="w-4 h-4 text-blue-500" />}
                    {article.type === 'article' && <BookOpen className="w-4 h-4 text-green-500" />}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {article.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{article.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {filteredFAQs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            FAQs {filteredFAQs.length > 0 && `(${filteredFAQs.length})`}
          </h2>
          <div className="bg-white rounded-lg border border-gray-200">
            {filteredFAQs.map((faq, index) => (
              <div key={faq.id} className={`p-4 ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFAQs.has(faq.id) ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> :
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <AnimatePresence>
                  {expandedFAQs.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-gray-600">{faq.answer}</p>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({faq.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-red-600">
                          <ThumbsDown className="w-4 h-4" />
                          <span>Not helpful</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any articles or FAQs matching your search.
          </p>
          <button
            onClick={handleBackToCategories}
            className="text-blue-600 hover:text-blue-700"
          >
            Browse all categories
          </button>
        </div>
      )}
    </div>
  );

  const ArticleView = () => {
    if (!selectedArticle) return null;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={handleBackToCategories} className="hover:text-blue-600">
            Help
          </button>
          <ChevronRight className="w-4 h-4" />
          <span>{helpCategories.find(c => c.id === selectedArticle.category)?.name}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{selectedArticle.title}</span>
        </div>

        {/* Article Header */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
              <p className="text-gray-600">{selectedArticle.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedArticle.type === 'video' && (
                <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <Video className="w-4 h-4" />
                  <span>Watch Video</span>
                </button>
              )}
              {selectedArticle.downloadUrl && (
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{selectedArticle.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{selectedArticle.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{selectedArticle.rating}</span>
            </div>
            <span>{selectedArticle.views} views</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedArticle.tags.map((tag) => (
              <span key={tag} className="flex items-center space-x-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: selectedArticle.content.replace(/\n/g, '<br/>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') 
            }} />
          </div>
        </div>

        {/* Article Footer */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Was this article helpful?</h3>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes ({selectedArticle.helpful})</span>
                </button>
                <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                  <ThumbsDown className="w-4 h-4" />
                  <span>No</span>
                </button>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <MessageCircle className="w-4 h-4" />
                  <span>Leave Feedback</span>
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Last updated: {new Date(selectedArticle.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            <div>
              {activeView !== 'categories' && (
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Help Center</span>
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {activeView === 'categories' && 'Find answers and learn how to use the Smart Tourist Safety System'}
                {activeView === 'search' && 'Search results and category articles'}
                {activeView === 'article' && 'Detailed guide and documentation'}
              </p>
            </div>
            {activeView !== 'article' && (
              <div className="flex items-center space-x-4">
                <ThemeToggle variant="button" size="md" showLabel />
                <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {activeView !== 'article' && (
          <div className="mb-8">
            <SearchBar />
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'categories' && <CategoryView />}
            {activeView === 'search' && <SearchView />}
            {activeView === 'article' && <ArticleView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}