/**
 * Smart Tourist Safety System - Heatmap Layer Component
 * Advanced heatmap visualization for tourist density, incident frequency, and risk assessment
 */

'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Eye, 
  Settings,
  Filter,
  Download,
  Layers,
  BarChart3,
  TrendingUp,
  MapPin
} from 'lucide-react';

// Ensure we have a heatmap plugin (you might need to install leaflet.heat)
// For now, we'll create a custom implementation

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface HeatmapDataPoint {
  lat: number;
  lng: number;
  intensity: number;
  type: 'tourist' | 'incident' | 'risk' | 'emergency';
  timestamp?: string;
  metadata?: Record<string, any>;
}

interface HeatmapLayerProps {
  data: HeatmapDataPoint[];
  type: 'density' | 'incidents' | 'risk' | 'combined';
  intensity?: number;
  radius?: number;
  blur?: number;
  maxZoom?: number;
  visible?: boolean;
  gradient?: Record<number, string>;
  onDataPointClick?: (point: HeatmapDataPoint) => void;
  className?: string;
}

interface HeatmapControlsProps {
  layer: 'density' | 'incidents' | 'risk' | 'combined';
  onLayerChange: (layer: string) => void;
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

// ============================================================================
// HEATMAP GRADIENTS
// ============================================================================

const HEATMAP_GRADIENTS = {
  density: {
    0.0: 'rgba(0, 0, 255, 0)',
    0.2: 'rgba(0, 0, 255, 0.2)',
    0.4: 'rgba(0, 255, 255, 0.4)',
    0.6: 'rgba(0, 255, 0, 0.6)',
    0.8: 'rgba(255, 255, 0, 0.8)',
    1.0: 'rgba(255, 0, 0, 1.0)'
  },
  incidents: {
    0.0: 'rgba(255, 165, 0, 0)',
    0.3: 'rgba(255, 165, 0, 0.3)',
    0.5: 'rgba(255, 69, 0, 0.5)',
    0.7: 'rgba(255, 0, 0, 0.7)',
    1.0: 'rgba(139, 0, 0, 1.0)'
  },
  risk: {
    0.0: 'rgba(34, 197, 94, 0)',
    0.25: 'rgba(34, 197, 94, 0.3)',
    0.5: 'rgba(234, 179, 8, 0.5)',
    0.75: 'rgba(239, 68, 68, 0.7)',
    1.0: 'rgba(127, 29, 29, 1.0)'
  },
  emergency: {
    0.0: 'rgba(220, 38, 127, 0)',
    0.4: 'rgba(220, 38, 127, 0.4)',
    0.6: 'rgba(239, 68, 68, 0.6)',
    0.8: 'rgba(185, 28, 28, 0.8)',
    1.0: 'rgba(127, 29, 29, 1.0)'
  }
};

// ============================================================================
// CUSTOM HEATMAP IMPLEMENTATION
// ============================================================================

class CustomHeatmap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private map: L.Map;
  private layer: HTMLElement | null = null;

  constructor(map: L.Map) {
    this.map = map;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvas();
  }

  private setupCanvas() {
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '200';
  }

  public setData(data: HeatmapDataPoint[], options: {
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
    intensity?: number;
  } = {}) {
    const {
      radius = 25,
      blur = 15,
      gradient = HEATMAP_GRADIENTS.density,
      intensity = 1.0
    } = options;

    this.clearCanvas();
    this.resizeCanvas();

    // Create gradient
    const gradientCanvas = this.createGradient(gradient);

    // Draw heat points
    data.forEach(point => {
      this.drawPoint(point, radius, blur, intensity);
    });

    // Apply gradient
    this.applyGradient(gradientCanvas);
  }

  private resizeCanvas() {
    const mapSize = this.map.getSize();
    this.canvas.width = mapSize.x;
    this.canvas.height = mapSize.y;
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawPoint(point: HeatmapDataPoint, radius: number, blur: number, intensity: number) {
    const mapPoint = this.map.latLngToContainerPoint([point.lat, point.lng]);
    
    const gradient = this.ctx.createRadialGradient(
      mapPoint.x, mapPoint.y, 0,
      mapPoint.x, mapPoint.y, radius
    );
    
    const alpha = Math.min(point.intensity * intensity, 1);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(mapPoint.x, mapPoint.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private createGradient(gradient: Record<number, string>): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    Object.entries(gradient).forEach(([stop, color]) => {
      grad.addColorStop(parseFloat(stop), color);
    });
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 1);
    
    return canvas;
  }

  private applyGradient(gradientCanvas: HTMLCanvasElement) {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;
    const gradientData = gradientCanvas.getContext('2d')!.getImageData(0, 0, 256, 1).data;

    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha > 0) {
        const colorIndex = Math.floor((alpha / 255) * 255) * 4;
        pixels[i] = gradientData[colorIndex];
        pixels[i + 1] = gradientData[colorIndex + 1];
        pixels[i + 2] = gradientData[colorIndex + 2];
        pixels[i + 3] = gradientData[colorIndex + 3];
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  public addToMap() {
    if (!this.layer) {
      this.layer = L.DomUtil.create('div', 'heatmap-layer');
      this.layer.appendChild(this.canvas);
      this.map.getPanes().overlayPane!.appendChild(this.layer);
    }
  }

  public removeFromMap() {
    if (this.layer && this.layer.parentNode) {
      this.layer.parentNode.removeChild(this.layer);
      this.layer = null;
    }
  }

  public update() {
    this.resizeCanvas();
  }
}

// ============================================================================
// HEATMAP CONTROLS COMPONENT
// ============================================================================

const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  layer,
  onLayerChange,
  intensity,
  onIntensityChange,
  radius,
  onRadiusChange,
  visible,
  onVisibilityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const layerOptions = [
    { value: 'density', label: 'Tourist Density', icon: Users, color: 'blue' },
    { value: 'incidents', label: 'Incident Frequency', icon: AlertTriangle, color: 'orange' },
    { value: 'risk', label: 'Risk Assessment', icon: Activity, color: 'red' },
    { value: 'combined', label: 'Combined View', icon: Layers, color: 'purple' }
  ];

  return (
    <motion.div
      className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Heatmap</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVisibilityChange(!visible)}
            className={`p-1.5 rounded-lg transition-colors ${
              visible 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Selection */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {layerOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onLayerChange(option.value)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  layer === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 dark:bg-${option.color}-900 dark:text-${option.color}-300`
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4"
          >
            {/* Intensity Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Intensity: {Math.round(intensity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={intensity}
                onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Radius Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Radius: {radius}px
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Export Options */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// HEATMAP LEGEND COMPONENT
// ============================================================================

const HeatmapLegend: React.FC<{ 
  type: string; 
  gradient: Record<number, string>;
  visible: boolean;
}> = ({ type, gradient, visible }) => {
  if (!visible) return null;

  const legendLabels = {
    density: ['Low', 'Medium', 'High', 'Very High'],
    incidents: ['Rare', 'Occasional', 'Frequent', 'Critical'],
    risk: ['Safe', 'Caution', 'Warning', 'Danger'],
    combined: ['Safe', 'Moderate', 'High Risk', 'Critical']
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {type.charAt(0).toUpperCase() + type.slice(1)} Intensity
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-32 h-3 rounded-full overflow-hidden bg-gradient-to-r from-transparent via-yellow-500 to-red-600"></div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 w-32">
          {legendLabels[type as keyof typeof legendLabels]?.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN HEATMAP LAYER COMPONENT
// ============================================================================

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  data,
  type = 'density',
  intensity = 1.0,
  radius = 25,
  blur = 15,
  visible = true,
  gradient,
  onDataPointClick,
  className = ''
}) => {
  const map = useMap();
  const heatmapRef = useRef<CustomHeatmap | null>(null);
  const [currentLayer, setCurrentLayer] = useState(type);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [currentRadius, setCurrentRadius] = useState(radius);
  const [isVisible, setIsVisible] = useState(visible);

  // Initialize heatmap
  useEffect(() => {
    if (map && !heatmapRef.current) {
      heatmapRef.current = new CustomHeatmap(map);
      heatmapRef.current.addToMap();
    }

    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.removeFromMap();
      }
    };
  }, [map]);

  // Update heatmap data
  useEffect(() => {
    if (heatmapRef.current && isVisible && data.length > 0) {
      const currentGradient = gradient || HEATMAP_GRADIENTS[currentLayer as keyof typeof HEATMAP_GRADIENTS] || HEATMAP_GRADIENTS.density;
      
      heatmapRef.current.setData(data, {
        radius: currentRadius,
        blur,
        gradient: currentGradient,
        intensity: currentIntensity
      });
    } else if (heatmapRef.current && !isVisible) {
      heatmapRef.current.setData([], {});
    }
  }, [data, currentLayer, currentIntensity, currentRadius, blur, gradient, isVisible]);

  // Handle map events
  useEffect(() => {
    const handleMapMove = () => {
      if (heatmapRef.current) {
        heatmapRef.current.update();
      }
    };

    map.on('moveend', handleMapMove);
    map.on('zoomend', handleMapMove);
    map.on('resize', handleMapMove);

    return () => {
      map.off('moveend', handleMapMove);
      map.off('zoomend', handleMapMove);
      map.off('resize', handleMapMove);
    };
  }, [map]);

  const currentGradient = gradient || HEATMAP_GRADIENTS[currentLayer as keyof typeof HEATMAP_GRADIENTS] || HEATMAP_GRADIENTS.density;

  return (
    <>
      <HeatmapControls
        layer={currentLayer as any}
        onLayerChange={(layer: string) => setCurrentLayer(layer as any)}
        intensity={currentIntensity}
        onIntensityChange={setCurrentIntensity}
        radius={currentRadius}
        onRadiusChange={setCurrentRadius}
        visible={isVisible}
        onVisibilityChange={setIsVisible}
      />
      
      <HeatmapLegend
        type={currentLayer}
        gradient={currentGradient}
        visible={isVisible}
      />
    </>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default HeatmapLayer;
export type { HeatmapDataPoint, HeatmapLayerProps };
