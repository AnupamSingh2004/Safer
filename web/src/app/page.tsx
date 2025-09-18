'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Heart,
  LogIn,
  UserPlus,
  Mail
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { useAuthStore } from '@/stores/auth-store';
import { LoadingSpinner } from '@/components/animations/loading-spinner';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (mounted && isInitialized && isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, mounted, user, router]);

  // Demo button handler
  const handleWatchDemo = () => {
    setIsDemoLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      window.open('https://www.youtube.com/watch?v=demo-video', '_blank');
      setIsDemoLoading(false);
    }, 500);
  };

  // Show loading spinner during authentication check
  if (!mounted || isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-white/80">Initializing Smart Tourist Safety System...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show redirecting message
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-white/80">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  const features = [
    {
      icon: Shield,
      title: "Digital Identity",
      description: "Blockchain-based secure tourist IDs with comprehensive KYC verification for enhanced safety",
      color: "from-blue-500 to-blue-600",
      href: "/dashboard/tourists"
    },
    {
      icon: MapPin,
      title: "Smart Geo-Fencing",
      description: "AI-powered zone monitoring with real-time location tracking and instant safety alerts",
      color: "from-green-500 to-green-600",
      href: "/dashboard/location"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description: "Instant SOS alerts with automated emergency dispatch and real-time coordination",
      color: "from-red-500 to-red-600",
      href: "/dashboard/alerts"
    },
    {
      icon: Users,
      title: "Tourist Management",
      description: "Comprehensive dashboard for monitoring tourist activities and ensuring their safety",
      color: "from-purple-500 to-purple-600",
      href: "/dashboard/tourists"
    },
    {
      icon: Smartphone,
      title: "Mobile Integration",
      description: "Seamless mobile app integration for tourists with offline emergency features",
      color: "from-orange-500 to-orange-600",
      href: "/dashboard/communication"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Advanced analytics for tourism patterns, safety trends, and predictive alerts",
      color: "from-indigo-500 to-indigo-600",
      href: "/dashboard/analytics"
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
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Smart Tourist Safety
            </h1>
            
            <h2 className="text-xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              AI-Powered Protection for Every Journey
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Revolutionary safety monitoring system combining blockchain identity verification, 
              real-time location tracking, and instant emergency response to ensure tourist safety across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="group inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={handleWatchDemo}
                disabled={isDemoLoading}
                className="group inline-flex items-center px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Play className={`w-5 h-5 mr-2 ${isDemoLoading ? 'animate-spin' : ''}`} />
                {isDemoLoading ? 'Loading...' : 'Watch Demo'}
              </button>
              
              <Link
                href="/demo/transitions"
                className="group inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
              >
                <Zap className="w-4 h-4 mr-2" />
                🎬 Try Transitions
              </Link>
            </div>

            {/* Mobile App Download Section */}
            <div className="flex flex-col items-center mt-8 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Download Mobile App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                Get instant access to emergency services, real-time alerts, and safety features on your mobile device.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Android app will be available soon! Currently in beta testing.');
                  }}
                  className="group inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5665 0-.8467-.5378-.8467-1.1748 0-.6575.237-1.1748.8467-1.1748.6097 0 .8467.5173.8467 1.1748 0 .637-.237 1.1748-.8467 1.1748zm-11.046 0c-.5665 0-.8467-.5378-.8467-1.1748 0-.6575.237-1.1748.8467-1.1748.6097 0 .8467.5173.8467 1.1748 0 .637-.237 1.1748-.8467 1.1748zm5.523-1.1748c0-1.3622.834-2.4076 1.9937-2.4076 1.1597 0 1.9937 1.0454 1.9937 2.4076 0 1.3622-.834 2.4076-1.9937 2.4076-1.1597 0-1.9937-1.0454-1.9937-2.4076z"/>
                  </svg>
                  Google Play
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('iOS app will be available soon! Currently in development.');
                  }}
                  className="group inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </a>
              </div>
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
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Comprehensive Safety Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Advanced technology stack designed to provide 360-degree protection for tourists 
              while maintaining privacy and ensuring seamless travel experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link 
                  key={index} 
                  href={feature.href}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 block"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-blue-500" />
                  </div>
                </Link>
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
              href="/register"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Shield className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-5 h-5 mr-2" />
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
              <Link href="/" className="flex items-center space-x-3 mb-4 group">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-300 transition-colors">Smart Tourist Safety</h3>
                  <p className="text-sm text-gray-400">Government of India</p>
                </div>
              </Link>
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
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><a href="mailto:support@touristsafety.gov.in" className="hover:text-white transition-colors">Email Support</a></li>
                <li><a href="tel:+91-1800-XXX-XXXX" className="hover:text-white transition-colors">Emergency Hotline</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
