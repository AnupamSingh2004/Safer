/**
 * Transition Examples - Practical implementation examples
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LoadingTransition,
  useManualTransition,
  ScaleTransition,
  FadeTransition
} from "@/components/transitions/page-transition";
import { 
  ModalLayoutTransition,
  SharedElementTransition
} from "@/components/transitions/layout-transition";
import { Loader2, CheckCircle, X, Image as ImageIcon } from "lucide-react";

export function LoadingTransitionExample() {
  const [isLoading, setIsLoading] = useState(false);
  
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Loading Transition</h3>
      
      <LoadingTransition 
        isLoading={isLoading}
        loadingComponent={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Loading content...</span>
          </div>
        }
      >
        <div className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Content Loaded!</h4>
          <p className="text-gray-600">This content appeared with a smooth fade transition.</p>
        </div>
      </LoadingTransition>
      
      <button
        onClick={simulateLoading}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Loading...' : 'Simulate Loading'}
      </button>
    </div>
  );
}

export function ModalTransitionExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Modal Transition</h3>
      
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Open Modal
      </button>

      <ModalLayoutTransition
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This modal uses the layout transition system with spring physics for smooth entry and exit.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalLayoutTransition>
    </div>
  );
}

export function SharedElementExample() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const images = [
    { id: 'img1', src: '/placeholder-1.jpg', alt: 'Tourist Location 1' },
    { id: 'img2', src: '/placeholder-2.jpg', alt: 'Tourist Location 2' },
    { id: 'img3', src: '/placeholder-3.jpg', alt: 'Tourist Location 3' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Shared Element Transition</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(image.id)}
          >
            <SharedElementTransition layoutId={image.id}>
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            </SharedElementTransition>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-lg mx-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <SharedElementTransition layoutId={selectedImage}>
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-24 h-24 text-white" />
                </div>
              </SharedElementTransition>
              
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-sm text-gray-600">
        Click on any image to see the shared element transition in action.
      </p>
    </div>
  );
}

export function TransitionControlExample() {
  const { triggerTransition } = useManualTransition();
  const [currentType, setCurrentType] = useState<'slide' | 'fade' | 'scale'>('slide');

  const handleTransitionChange = (type: 'slide' | 'fade' | 'scale') => {
    setCurrentType(type);
    triggerTransition('forward', type);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Manual Transition Control</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Current transition type: <span className="font-medium">{currentType}</span>
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleTransitionChange('slide')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentType === 'slide'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Slide
            </button>
            <button
              onClick={() => handleTransitionChange('fade')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentType === 'fade'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              Fade
            </button>
            <button
              onClick={() => handleTransitionChange('scale')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentType === 'scale'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Scale
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Navigate to different pages to see the selected transition type in action.
            The transition will be applied to subsequent page navigations.
          </p>
        </div>
      </div>
    </div>
  );
}

export function StaggeredListExample() {
  const [items, setItems] = useState([
    { id: 1, title: 'Emergency Alert #1', status: 'active' },
    { id: 2, title: 'Tourist Safety Check', status: 'resolved' },
    { id: 3, title: 'Location Update', status: 'pending' },
  ]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      title: `New Alert #${items.length + 1}`,
      status: 'active'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Staggered List Animation</h3>
      
      <motion.div
        layout
        className="space-y-3 mb-4"
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.status === 'active' ? 'bg-red-500' :
                  item.status === 'pending' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <span className="font-medium">{item.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'active' ? 'bg-red-100 text-red-700' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <button
        onClick={addItem}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Add Item
      </button>
    </div>
  );
}