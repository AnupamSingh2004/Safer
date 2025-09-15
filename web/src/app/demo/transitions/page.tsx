/**
 * Transition Demo Page - Showcase page transitions
 */

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home, User, Settings, AlertTriangle } from "lucide-react";
import { 
  usePageTransition, 
  useManualTransition,
  useTransitionState 
} from "@/components/transitions/page-transition";
import { childVariants, listItemVariants } from "@/lib/animations";
import {
  LoadingTransitionExample,
  ModalTransitionExample,
  SharedElementExample,
  TransitionControlExample,
  StaggeredListExample
} from "@/components/transitions/transition-examples";

export default function TransitionDemoPage() {
  const { triggerTransition } = useManualTransition();
  const { isAnimating, direction, transitionType } = useTransitionState();

  const demoLinks = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: Home,
      description: "View main dashboard with slide transition",
      pageType: "dashboard" as const,
    },
    {
      href: "/auth/login",
      title: "Login",
      icon: User,
      description: "Authentication page with fade transition",
      pageType: "auth" as const,
    },
    {
      href: "/emergency",
      title: "Emergency",
      icon: AlertTriangle,
      description: "Emergency page with scale transition",
      pageType: "emergency" as const,
    },
    {
      href: "/settings",
      title: "Settings",
      icon: Settings,
      description: "Settings page with default transition",
      pageType: "public" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={childVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎬 Page Transition Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience ultra-smooth 60fps page transitions powered by Framer Motion.
            Each page type has custom animation variants optimized for performance.
          </p>
        </motion.div>

        {/* Transition Status */}
        <motion.div
          variants={childVariants}
          className="bg-white rounded-lg p-6 mb-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Transition Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Status</div>
              <div className={`text-lg font-bold ${isAnimating ? 'text-blue-600' : 'text-green-600'}`}>
                {isAnimating ? '🎬 Animating' : '✅ Ready'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Direction</div>
              <div className="text-lg font-bold text-purple-600">
                {direction === 'forward' ? '→ Forward' : '← Backward'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Type</div>
              <div className="text-lg font-bold text-indigo-600">
                {transitionType === 'slide' ? '📱 Slide' : 
                 transitionType === 'fade' ? '🌫️ Fade' : '🔄 Scale'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demo Links Grid */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {demoLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.href}
                variants={listItemVariants}
                className="group"
              >
                <Link
                  href={link.href}
                  onClick={() => {
                    // Pre-configure transition based on page type
                    if (link.pageType === 'emergency') {
                      triggerTransition('forward', 'scale');
                    } else if (link.pageType === 'auth') {
                      triggerTransition('forward', 'fade');
                    } else {
                      triggerTransition('forward', 'slide');
                    }
                  }}
                  className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`
                      p-3 rounded-lg
                      ${link.pageType === 'emergency' ? 'bg-red-100 text-red-600' :
                        link.pageType === 'auth' ? 'bg-blue-100 text-blue-600' :
                        link.pageType === 'dashboard' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {link.description}
                      </p>
                      <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                        <span>Try transition</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Manual Transition Controls */}
        <motion.div
          variants={childVariants}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Manual Transition Controls</h2>
          <p className="text-gray-600 mb-6">
            Test different transition types and directions manually:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => triggerTransition('forward', 'slide')}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              📱 Slide Forward
            </button>
            <button
              onClick={() => triggerTransition('backward', 'slide')}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              📱 Slide Back
            </button>
            <button
              onClick={() => triggerTransition('forward', 'fade')}
              className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              🌫️ Fade In
            </button>
            <button
              onClick={() => triggerTransition('forward', 'scale')}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              🔄 Scale Up
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              ← Browser Back
            </button>
            <Link
              href="/"
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium text-center"
            >
              🏠 Home
            </Link>
          </div>
        </motion.div>

        {/* Performance Info */}
        <motion.div
          variants={childVariants}
          className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚡ Performance Features
          </h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• GPU-accelerated animations using transform3d</li>
            <li>• Optimized for 60fps with will-change and contain properties</li>
            <li>• Automatic reduced motion support for accessibility</li>
            <li>• Smart direction detection based on navigation hierarchy</li>
            <li>• Page type detection for appropriate transition styles</li>
            <li>• Layout transition support for shared elements</li>
          </ul>
        </motion.div>

        {/* Interactive Examples */}
        <motion.div
          variants={childVariants}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingTransitionExample />
            <ModalTransitionExample />
            <SharedElementExample />
            <TransitionControlExample />
          </div>
          
          <div className="mt-6">
            <StaggeredListExample />
          </div>
        </motion.div>
      </div>
    </div>
  );
}