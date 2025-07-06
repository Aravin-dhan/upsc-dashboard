'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import {
  MapPin, Search, Brain, MessageCircle, Globe, Star, Mountain,
  Waves, TreePine, Factory, Landmark, RotateCcw
} from 'lucide-react';
import {
  optimizedIndiaLocations,
  searchLocations,
  getLocationsByType,
  OptimizedLocation,
  searchIndex
} from '@/data/optimizedMapData';
import { usePerformanceMonitor } from '@/components/performance/PerformanceMonitor';

// Lazy load the map core for better performance
const OptimizedMapCore = React.lazy(() => import('./OptimizedMapCore'));

// Skeleton loader component
const MapSkeleton = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-lg animate-pulse">
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-200 dark:bg-blue-700 rounded-full mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Optimized search component with debouncing
const FastSearch = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  onReset 
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onReset: () => void;
}) => {
  const [localTerm, setLocalTerm] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localTerm);
    }, 150);

    return () => clearTimeout(timer);
  }, [localTerm, onSearchChange]);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search locations, features, or UPSC topics..."
          value={localTerm}
          onChange={(e) => setLocalTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <button
        onClick={() => {
          setLocalTerm('');
          onReset();
        }}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        title="Reset filters"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
});

FastSearch.displayName = 'FastSearch';

// Optimized layer controls
const LayerControls = React.memo(({ 
  activeLayer, 
  onLayerChange 
}: {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}) => {
  const layers = useMemo(() => [
    { key: 'all', label: 'All Features', icon: Globe },
    { key: 'states', label: 'States & Capitals', icon: Star },
    { key: 'rivers', label: 'Rivers', icon: Waves },
    { key: 'mountains', label: 'Mountains & Plateaus', icon: Mountain },
    { key: 'parks', label: 'National Parks', icon: TreePine },
    { key: 'historical', label: 'Historical Sites', icon: Landmark },
    { key: 'economic', label: 'Economic Zones', icon: Factory }
  ], []);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {layers.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onLayerChange(key)}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeLayer === key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Icon className="h-3 w-3 mr-1.5" />
          {label}
        </button>
      ))}
    </div>
  );
});

LayerControls.displayName = 'LayerControls';

// Location details panel
const LocationDetails = React.memo(({ 
  location, 
  onClose 
}: {
  location: OptimizedLocation | null;
  onClose: () => void;
}) => {
  if (!location) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[1000]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              location.importance === 'high' ? 'bg-red-500 text-white' :
              location.importance === 'medium' ? 'bg-yellow-500 text-white' :
              'bg-green-500 text-white'
            }`}>
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {location.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {location.type.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{location.desc}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">UPSC Relevance</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">{location.relevance}</p>
          </div>

          {location.freq && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">Exam Frequency:</span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                {location.freq}%
              </span>
            </div>
          )}

          {location.topics && location.topics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Related Topics</h4>
              <div className="flex flex-wrap gap-2">
                {location.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

LocationDetails.displayName = 'LocationDetails';

interface FastInteractiveMapProps {
  height?: string;
  showControls?: boolean;
  showAIAssistant?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export default function FastInteractiveMap({
  height = '600px',
  showControls = true,
  showAIAssistant = true,
  initialCenter = [20.5937, 78.9629],
  initialZoom = 5
}: FastInteractiveMapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<OptimizedLocation | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Memoized filtered locations for performance
  const filteredLocations = useMemo(() => {
    let locations = optimizedIndiaLocations;

    // Apply search filter
    if (searchTerm.trim()) {
      locations = searchLocations(searchTerm);
    }

    // Apply layer filter
    if (activeLayer !== 'all') {
      locations = locations.filter(location => {
        const layerMap: { [key: string]: string[] } = {
          'states': ['state', 'capital'],
          'rivers': ['river'],
          'mountains': ['mountain', 'plateau'],
          'parks': ['national_park'],
          'historical': ['historical_site'],
          'economic': ['economic_zone', 'port']
        };
        
        const types = layerMap[activeLayer] || [activeLayer];
        return types.includes(location.type);
      });
    }

    return locations;
  }, [searchTerm, activeLayer]);

  // Optimized callbacks
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleLayerChange = useCallback((layer: string) => {
    setActiveLayer(layer);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setActiveLayer('all');
    setSelectedLocation(null);
  }, []);

  const handleLocationClick = useCallback((location: OptimizedLocation) => {
    setSelectedLocation(location);
  }, []);

  const handleLocationClose = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  // Preload map component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Search and Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-[1000] space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <FastSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onReset={handleReset}
            />
            <LayerControls
              activeLayer={activeLayer}
              onLayerChange={handleLayerChange}
            />
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="absolute top-4 right-4 z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
            <div className="flex items-center mb-3">
              <Brain className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Geography Assistant</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Click on any location to get detailed UPSC-relevant information and study tips.
            </p>
            <button className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask Geography Question
            </button>
          </div>
        </div>
      )}

      {/* Map Component with Suspense */}
      <Suspense fallback={<MapSkeleton />}>
        {isMapReady && (
          <OptimizedMapCore
            locations={filteredLocations}
            onLocationClick={handleLocationClick}
            height={height}
          />
        )}
      </Suspense>

      {/* Location Details Panel */}
      <LocationDetails
        location={selectedLocation}
        onClose={handleLocationClose}
      />

      {/* Performance Stats (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          Locations: {filteredLocations.length} | Rendered: {isMapReady ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
}
