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
  Play,
  Star,
  Award,
  Zap,
  Lock,
  Eye,
  Heart
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Digital Identity",
      description: "Blockchain-based secure tourist IDs with comprehensive KYC verification for enhanced safety",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MapPin,
      title: "Smart Geo-Fencing",
      description: "AI-powered zone monitoring with real-time location tracking and instant safety alerts",
      color: "from-green-500 to-green-600"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description: "Instant SOS alerts with automated emergency dispatch and real-time coordination",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Users,
      title: "Tourist Management",
      description: "Comprehensive dashboard for monitoring tourist activities and ensuring their safety",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Integration",
      description: "Seamless mobile app integration for tourists with offline emergency features",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Advanced analytics for tourism patterns, safety trends, and predictive alerts",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Tourists Protected", icon: Users },
    { number: "99.8%", label: "Response Success Rate", icon: CheckCircle },
    { number: "24/7", label: "Monitoring Coverage", icon: Eye },
    { number: "15+", label: "Partner States", icon: Globe }
  ];

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Tourism Director, Kerala",
      content: "This system has revolutionized how we ensure tourist safety. The real-time monitoring and instant alerts have significantly improved our response times.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "International Tourist",
      content: "I felt completely safe during my India trip. The digital ID and emergency features gave me peace of mind throughout my journey.",
      rating: 5
    },
    {
      name: "Inspector Priya Sharma",
      role: "Mumbai Police",
      content: "The integration with our emergency response system is seamless. We can now respond to tourist emergencies faster than ever before.",
      rating: 5
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 shadow-lg">
              <Award className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Government of India Initiative</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Smart Tourist Safety
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300">
              AI-Powered Protection for Every Journey
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Revolutionary safety monitoring system combining blockchain identity verification, 
              real-time location tracking, and instant emergency response to ensure tourist safety across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/login"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Government Certified
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 text-blue-500 mr-2" />
                Blockchain Secured
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                Real-time Monitoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Safety Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Advanced technology stack designed to provide 360-degree protection for tourists 
              while maintaining privacy and ensuring seamless travel experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Tourism Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how our platform is making a difference in tourist safety across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Heart className="w-16 h-16 text-white mx-auto mb-8" />
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Enhance Tourist Safety?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of tourism professionals who trust our platform to keep tourists safe. 
            Start protecting visitors today with our comprehensive safety monitoring system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Contact Sales
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
                AI-powered tourist safety monitoring system ensuring secure and memorable journeys across India.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 Government of India. All rights reserved.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
