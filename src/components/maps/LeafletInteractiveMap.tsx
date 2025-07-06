'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Layers, Search, Brain, MessageCircle, Globe, ZoomIn, ZoomOut,
  Navigation, Info, Star, Mountain, Waves, TreePine, Factory, Landmark,
  Filter, RotateCcw, Eye, EyeOff, Settings, Anchor, Sun
} from 'lucide-react';
import { indiaMapData, MapLocation } from '@/data/indiaMapData';

// Vanilla Leaflet implementation without react-leaflet
const VanillaLeafletMap = ({ height, showControls, showAIAssistant, initialCenter, initialZoom }: any) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'states' | 'rivers' | 'mountains' | 'parks' | 'historical' | 'economic'>('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamic import of Leaflet to avoid SSR issues
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([L]) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize map
      const map = L.map(mapRef.current!).setView(initialCenter, initialZoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add markers for filtered locations
      const filteredLocations = indiaMapData.filter(location => {
        const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             location.upscRelevance.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLayer = activeLayer === 'all' ||
                            (activeLayer === 'states' && (location.type === 'state' || location.type === 'capital')) ||
                            (activeLayer === 'rivers' && location.type === 'river') ||
                            (activeLayer === 'mountains' && (location.type === 'mountain' || location.type === 'plateau' || location.type === 'desert')) ||
                            (activeLayer === 'parks' && location.type === 'national_park') ||
                            (activeLayer === 'historical' && location.type === 'historical_site') ||
                            (activeLayer === 'economic' && (location.type === 'port' || location.type === 'economic_zone'));

        return matchesSearch && matchesLayer;
      });

      filteredLocations.forEach(location => {
        const color = location.importance === 'high' ? '#dc2626' :
                     location.importance === 'medium' ? '#f59e0b' : '#10b981';

        const marker = L.circleMarker(location.coordinates, {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-gray-900 mb-1">${location.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${location.description}</p>
            <p class="text-xs text-blue-600"><strong>UPSC Relevance:</strong> ${location.upscRelevance}</p>
            ${location.examFrequency ? `<p class="text-xs text-green-600 mt-1">Exam Frequency: ${location.examFrequency}%</p>` : ''}
          </div>
        `);

        marker.on('click', () => {
          setSelectedLocation(location);
        });
      });

      mapInstanceRef.current = map;
    }).catch(error => {
      console.error('Failed to load Leaflet:', error);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, searchTerm, activeLayer, initialCenter, initialZoom]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center p-8">
          <Globe className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Loading Interactive Map...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Initializing open-source mapping system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        style={{ height: '100%' }}
      />

      {/* Search and Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-[1000] space-y-4">
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations, features, or UPSC topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveLayer('all');
                  setSelectedLocation(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Layer Controls */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { key: 'all', label: 'All Features', icon: Globe },
                { key: 'states', label: 'States & Capitals', icon: Star },
                { key: 'rivers', label: 'Rivers', icon: Waves },
                { key: 'mountains', label: 'Mountains & Plateaus', icon: Mountain },
                { key: 'parks', label: 'National Parks', icon: TreePine },
                { key: 'historical', label: 'Historical Sites', icon: Landmark },
                { key: 'economic', label: 'Economic Zones', icon: Factory }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveLayer(key as any)}
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

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  selectedLocation.importance === 'high' ? 'bg-red-500 text-white' :
                  selectedLocation.importance === 'medium' ? 'bg-yellow-500 text-white' :
                  'bg-green-500 text-white'
                }`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {selectedLocation.type.replace('_', ' ')} • {selectedLocation.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLocation.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">UPSC Relevance</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">{selectedLocation.upscRelevance}</p>
              </div>

              {selectedLocation.examFrequency && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">Exam Frequency:</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {selectedLocation.examFrequency}%
                  </span>
                </div>
              )}

              {selectedLocation.relatedTopics && selectedLocation.relatedTopics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.relatedTopics.map((topic, index) => (
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
      )}
    </div>
  );
};

interface LeafletInteractiveMapProps {
  height?: string;
  showControls?: boolean;
  showAIAssistant?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export default function LeafletInteractiveMap({
  height = '600px',
  showControls = true,
  showAIAssistant = true,
  initialCenter = [20.5937, 78.9629], // Center of India
  initialZoom = 5
}: LeafletInteractiveMapProps) {
  return (
    <VanillaLeafletMap
      height={height}
      showControls={showControls}
      showAIAssistant={showAIAssistant}
      initialCenter={initialCenter}
      initialZoom={initialZoom}
    />
  );
}


