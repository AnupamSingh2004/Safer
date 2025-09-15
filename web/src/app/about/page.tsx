'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Smartphone,
  Globe,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Award,
  Zap,
  Lock,
  Eye,
  Heart,
  Target,
  Clock,
  Star,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  Database,
  Wifi,
  Search,
  BarChart3
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Blockchain-based identity verification ensures tamper-proof tourist records and secure data management.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "GPS-enabled geo-fencing provides continuous location monitoring with instant alerts for safety zones.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description: "24/7 emergency coordination with automated dispatch and multi-agency response protocols.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Integration",
      description: "Cross-platform mobile apps with offline capabilities for tourists and emergency services.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for tourism patterns, safety trends, and predictive risk assessment.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Multi-stakeholder",
      description: "Unified platform connecting tourists, police, tourism departments, and emergency services.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Tourists Protected", icon: Users },
    { number: "25+", label: "Partner States", icon: Globe },
    { number: "99.8%", label: "Response Success", icon: CheckCircle },
    { number: "24/7", label: "Monitoring", icon: Clock }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Project Inception",
      description: "Smart Tourist Safety initiative launched under Digital India mission",
      icon: Target
    },
    {
      year: "2024",
      title: "Pilot Implementation",
      description: "Successful pilot programs conducted in major tourist destinations",
      icon: Search
    },
    {
      year: "2024",
      title: "Technology Integration",
      description: "Blockchain identity system and AI-powered analytics deployed",
      icon: Database
    },
    {
      year: "2025",
      title: "National Rollout",
      description: "Full-scale implementation across all major tourist circuits in India",
      icon: Globe
    }
  ];

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Project Director",
      department: "Ministry of Tourism",
      description: "Leading digital transformation in Indian tourism safety",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      role: "Technical Lead",
      department: "National Informatics Centre",
      description: "Architecting scalable safety monitoring solutions",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b070?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Inspector Arjun Singh",
      role: "Security Coordinator",
      department: "Ministry of Home Affairs",
      description: "Coordinating multi-agency emergency response protocols",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Dr. Anita Verma",
      role: "Research Director",
      department: "Indian Institute of Technology",
      description: "Developing AI algorithms for predictive safety analytics",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 shadow-lg mb-8">
              <Award className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">About Our Mission</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-6">
              Revolutionizing Tourist Safety
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              A comprehensive digital ecosystem ensuring the safety and security of tourists across India through 
              cutting-edge technology, real-time monitoring, and coordinated emergency response.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/help"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              To create a comprehensive, technology-driven safety ecosystem that protects tourists while preserving 
              the natural beauty and cultural heritage of India's diverse destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Building Trust Through Technology
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our Smart Tourist Safety System represents a paradigm shift in how we approach tourist security. 
                By leveraging blockchain technology for identity verification, AI for predictive analytics, and 
                IoT for real-time monitoring, we create an invisible safety net that operates seamlessly in the background.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The system is designed with privacy at its core, ensuring that tourists can explore with confidence 
                while maintaining their personal freedom. Emergency response teams are equipped with real-time data 
                to provide rapid assistance when needed.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Privacy-first design</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Real-time response</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rotate-6"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Security First</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    End-to-end encryption and blockchain-based identity verification ensure maximum security.
                  </p>
                  
                  <div className="flex items-center space-x-3 pt-4">
                    <Eye className="w-8 h-8 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Continuous Monitoring</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    24/7 monitoring with intelligent alerts and automated emergency response protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Advanced technology components working together to create a comprehensive safety ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From conception to nationwide implementation, tracking our progress in revolutionizing tourist safety.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10"></div>
                    
                    {/* Content */}
                    <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Meet the experts driving innovation in tourist safety and digital governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300"></div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{member.department}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Heart className="w-16 h-16 text-white mx-auto mb-8" />
          
          <h2 className="text-4xl font-bold text-white mb-6">Our Vision for the Future</h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            To establish India as the world's safest tourist destination by creating an intelligent, 
            interconnected safety ecosystem that anticipates risks, prevents incidents, and ensures 
            rapid response when emergencies occur.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Globe className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Global Standards</h3>
              <p className="text-sm text-blue-100">World-class safety protocols aligned with international best practices</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Zap className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Innovation Hub</h3>
              <p className="text-sm text-blue-100">Continuous innovation in safety technology and emergency response</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Impact</h3>
              <p className="text-sm text-blue-100">Empowering local communities while protecting visitors</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Join Our Mission
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Smart Tourist Safety</h3>
                  <p className="text-sm text-gray-400">Government of India</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Revolutionizing tourist safety through technology, ensuring secure and memorable journeys across India.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 Government of India. All rights reserved.
              </div>
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
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
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
                  <Building className="w-4 h-4 mr-2" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;