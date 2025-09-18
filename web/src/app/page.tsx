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
import '@/styles/home-animations.css';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const features = [
    {
      icon: Shield,
      title: "Digital Identity Verification",
      description: "Secure blockchain-based tourist IDs specifically designed for North East India's remote regions with comprehensive KYC verification",
      color: "from-blue-500 to-blue-600",
      href: "/dashboard/tourists",
      locations: ["Guwahati", "Shillong", "Itanagar"]
    },
    {
      icon: MapPin,
      title: "Smart Geo-Fencing for Northeast",
      description: "Advanced zone monitoring across Assam, Meghalaya, Arunachal Pradesh and other NE states with real-time tracking",
      color: "from-green-500 to-green-600",
      href: "/dashboard/location",
      locations: ["Kaziranga", "Tawang", "Cherrapunji"]
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response Network",
      description: "Instant SOS alerts connected to Northeast India's emergency services with helicopter rescue coordination",
      color: "from-red-500 to-red-600",
      href: "/dashboard/alerts",
      locations: ["Police Stations", "Hospitals", "Rescue Centers"]
    },
    {
      icon: Users,
      title: "Tourist Safety Management",
      description: "Comprehensive monitoring of domestic and international tourists exploring Northeast India's pristine landscapes",
      color: "from-purple-500 to-purple-600",
      href: "/dashboard/tourists",
      locations: ["Tourist Groups", "Solo Travelers", "Adventure Tours"]
    },
    {
      icon: Smartphone,
      title: "Offline Mobile Support",
      description: "Mobile app with offline capabilities for remote areas of Northeast where network connectivity is limited",
      color: "from-orange-500 to-orange-600",
      href: "/dashboard/communication",
      locations: ["Remote Villages", "Trekking Routes", "Border Areas"]
    },
    {
      icon: TrendingUp,
      title: "Northeast Tourism Analytics",
      description: "Advanced analytics for tourism patterns in Seven Sister States with weather and seasonal trend insights",
      color: "from-indigo-500 to-indigo-600",
      href: "/dashboard/analytics",
      locations: ["Seasonal Data", "Weather Patterns", "Tourist Flow"]
    }
  ];

  const stats = [
    { number: "8.5K+", label: "NE Tourists Protected", icon: Users },
    { number: "99.9%", label: "Response Success Rate", icon: CheckCircle },
    { number: "24/7", label: "Northeast Coverage", icon: Eye },
    { number: "7+", label: "Sister States Connected", icon: Globe }
  ];

  const testimonials = [
    {
      name: "Dr. Kiran Bora",
      role: "Tourism Director, Assam",
      content: "This system has been revolutionary for monitoring tourists visiting Kaziranga and other remote locations in Northeast India. The real-time tracking has significantly improved our emergency response capabilities.",
      rating: 5
    },
    {
      name: "Emma Richardson",
      role: "International Tourist from UK",
      content: "Felt completely secure while trekking in Arunachal Pradesh. The digital ID and emergency features gave me confidence to explore the beautiful but remote regions of Northeast India.",
      rating: 5
    },
    {
      name: "Inspector Rupa Devi",
      role: "Meghalaya Police",
      content: "The integration with our emergency services across the seven sister states is seamless. We can now coordinate rescue operations in Meghalaya's difficult terrain much more effectively.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Geometric Shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              />
            ))}
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-12">
            {/* Professional Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-blue-900/30 backdrop-blur-sm rounded-lg border border-blue-400/30 shadow-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <Shield className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-white">🇮🇳 Government of India Initiative</span>
              </div>
            </div>

            {/* Clean Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Smart Tourist Safety
              </h1>
              
              <div className="relative">
                <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-blue-200 mb-4">
                  Advanced Protection for Northeast India Tourism
                </h2>
                <div className="w-24 h-0.5 bg-blue-400 mx-auto"></div>
              </div>
            </div>

            {/* Enhanced Description */}
            <div className="max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-blue-100 leading-relaxed backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/20">
                Revolutionary safety monitoring system for <span className="text-cyan-300 font-medium">Northeast India&apos;s unique terrain</span>, 
                combining <span className="text-blue-300 font-medium">blockchain identity verification</span>, 
                <span className="text-purple-300 font-medium">real-time tracking</span>, and <span className="text-green-300 font-medium">instant emergency response</span> 
                across the Seven Sister States.
              </p>
            </div>

            {/* Professional CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="group inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Shield className="w-5 h-5 mr-3" />
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* <button 
                onClick={handleWatchDemo}
                disabled={isDemoLoading}
                className="group inline-flex items-center px-8 py-4 text-base font-semibold text-blue-600 bg-white hover:bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Play className={`w-5 h-5 mr-3 ${isDemoLoading ? 'animate-spin' : ''}`} />
                {isDemoLoading ? 'Loading Demo...' : 'Watch Demo'}
              </button> */}
              
              <Link
                href="/geo-map.html"
                target="_blank"
                className="group inline-flex items-center px-6 py-3 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <MapPin className="w-4 h-4 mr-2" />
                🗺️ View Geo-fencing Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile App Section */}
            <div className="relative">
              <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white ml-4">Download Mobile App</h3>
                </div>
                <p className="text-base text-blue-100 mb-6 text-center max-w-xl">
                  Get instant access to emergency services and offline safety features for Northeast India&apos;s remote terrain.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('🚀 Android app launching soon! Currently in final testing phase.');
                    }}
                    className="inline-flex items-center px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="text-lg mr-2">📱</span>
                    Google Play
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('🍎 iOS app coming soon! Development in progress.');
                    }}
                    className="inline-flex items-center px-6 py-3 text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="text-lg mr-2">🍎</span>
                    App Store
                  </a>
                </div>
              </div>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
              {[
                { icon: CheckCircle, text: "Government Certified", color: "text-green-400" },
                { icon: Lock, text: "Blockchain Secured", color: "text-blue-400" },
                { icon: Zap, text: "Real-time Monitoring", color: "text-yellow-400" },
                { icon: Heart, text: "8.5K+ Northeast Tourists Protected", color: "text-pink-400" }
              ].map((indicator, index) => (
                <div key={index} className="flex items-center group hover:scale-110 transition-transform duration-300">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg mr-3 group-hover:bg-white/20 transition-colors">
                    <indicator.icon className={`w-5 h-5 ${indicator.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                    {indicator.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Protecting Northeast India&apos;s Tourism
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time impact across the Seven Sister States
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-blue-100">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* System Status */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Live System Status:</span>
              </div>
              <span className="text-white text-sm ml-4">All Systems Operational</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-6">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Advanced Technology Stack</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Comprehensive Safety Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced technology stack designed to provide 360-degree protection for tourists 
              while maintaining privacy and ensuring seamless travel experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link 
                  key={index} 
                  href={feature.href}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg shadow-md mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {feature.locations && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {feature.locations.map((location, locationIndex) => (
                          <span 
                            key={locationIndex}
                            className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Technology Stack Showcase */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Powered by Advanced Technologies
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                { name: "Blockchain", icon: "🔗" },
                { name: "AI/ML", icon: "🤖" },
                { name: "Real-time Analytics", icon: "📊" },
                { name: "IoT Integration", icon: "📡" },
                { name: "Cloud Computing", icon: "☁️" },
                { name: "Mobile Native", icon: "📱" }
              ].map((tech, index) => (
                <div key={index} className="flex items-center px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl mr-3">{tech.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{tech.name}</span>
                </div>
              ))}
            </div>
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
                  &ldquo;{testimonial.content}&rdquo;
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
    </div>
  );
};

export default HomePage;
