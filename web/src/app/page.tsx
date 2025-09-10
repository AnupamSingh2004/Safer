'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Eye, 
  Globe,
  Smartphone,
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { LoadingSpinner, PageLoading } from '@/components/common/loading';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Simulate auth check
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check for token in localStorage (in real app, validate with backend)
        const token = localStorage.getItem('auth_token');
        const isAuth = !!token;
        
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          // Redirect to dashboard if authenticated
          router.push('/dashboard/overview');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGetStarted = () => {
    router.push('/register');
  };

  if (loading) {
    return <PageLoading message="Initializing Smart Tourist Safety System..." />;
  }

  if (isAuthenticated) {
    return <PageLoading message="Redirecting to dashboard..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Tourist Safety</h1>
                <p className="text-xs text-gray-600">Monitoring & Response System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="h-4 w-4" />
                AI-Powered Tourist Safety Solution
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Protect Every
                <span className="text-blue-600 block">Tourist Journey</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Advanced monitoring system using AI, blockchain, and geofencing to ensure tourist safety 
                with real-time alerts, digital identity verification, and emergency response coordination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                >
                  Start Monitoring
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold text-lg transition-all hover:shadow-md"
                >
                  <Eye className="h-5 w-5" />
                  View Demo
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                {
                  icon: Shield,
                  title: 'Digital Identity',
                  description: 'Blockchain-based secure tourist IDs with KYC verification',
                  color: 'bg-blue-500'
                },
                {
                  icon: MapPin,
                  title: 'Geo-Fencing',
                  description: 'Smart zone monitoring with real-time location tracking',
                  color: 'bg-green-500'
                },
                {
                  icon: AlertTriangle,
                  title: 'Emergency Response',
                  description: 'Instant alerts and automated emergency dispatch system',
                  color: 'bg-red-500'
                },
                {
                  icon: BarChart3,
                  title: 'AI Analytics',
                  description: 'Predictive insights and anomaly detection for safety',
                  color: 'bg-purple-500'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`h-12 w-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h2>
                <p className="text-gray-600">Real-time monitoring capabilities</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Active Tourists', value: '2,847', icon: Users, change: '+12%' },
                  { label: 'Safety Zones', value: '156', icon: MapPin, change: '+5%' },
                  { label: 'Active Alerts', value: '3', icon: AlertTriangle, change: '-8%' },
                  { label: 'Response Time', value: '2.3min', icon: Shield, change: '-15%' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className={`text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last week
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Powered by Advanced Technology</h2>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {[
                  'AI/ML Analytics',
                  'Blockchain Security',
                  'Real-time Tracking',
                  'Multi-language Support',
                  'Emergency Dispatch',
                  'Geofencing'
                ].map((tech, index) => (
                  <div key={index} className="text-sm font-medium text-gray-700 px-4 py-2 bg-gray-100 rounded-full">
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center bg-blue-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Enhance Tourist Safety?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join the next generation of tourist safety management. Deploy our comprehensive 
                monitoring system to protect visitors and streamline emergency response.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="px-8 py-4 border border-blue-400 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold">Smart Tourist Safety</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Advanced tourist safety monitoring system for the digital age.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 Smart Tourist Safety System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
