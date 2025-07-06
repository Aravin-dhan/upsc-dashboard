'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, Layer, Source, NavigationControl, ScaleControl, FullscreenControl } from 'react-map-gl';
import {
  MapPin, Layers, Search, Brain, MessageCircle, Globe, ZoomIn, ZoomOut,
  Navigation, Info, Star, Mountain, Waves, TreePine, Factory, Landmark,
  Filter, RotateCcw, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapLocation {
  id: string;
  name: string;
  type: 'state' | 'capital' | 'river' | 'mountain' | 'national_park' | 'historical_site';
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  upscRelevance: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
  examFrequency?: number;
  relatedTopics?: string[];
}

interface MapboxInteractiveMapProps {
  height?: string;
  showControls?: boolean;
  showAIAssistant?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
  mapStyle?: string;
}

// Sample UPSC-relevant locations for India
const indiaLocations: MapLocation[] = [
  {
    id: 'new-delhi',
    name: 'New Delhi',
    type: 'capital',
    coordinates: [77.2090, 28.6139],
    description: 'Capital of India, seat of government',
    upscRelevance: 'Administrative center, political geography',
    importance: 'high',
    category: 'Political Geography',
    examFrequency: 95,
    relatedTopics: ['Indian Polity', 'Administrative Geography']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    type: 'capital',
    coordinates: [72.8777, 19.0760],
    description: 'Financial capital of India, major port city',
    upscRelevance: 'Economic geography, urbanization, port development',
    importance: 'high',
    category: 'Economic Geography',
    examFrequency: 90,
    relatedTopics: ['Economic Geography', 'Urbanization', 'Port Development']
  },
  {
    id: 'ganges',
    name: 'River Ganges',
    type: 'river',
    coordinates: [82.5937, 25.3176],
    description: 'Holiest river in Hinduism, major river system',
    upscRelevance: 'River systems, water resources, cultural significance',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 85,
    relatedTopics: ['River Systems', 'Water Resources', 'Cultural Geography']
  },
  {
    id: 'himalayas',
    name: 'Himalayas',
    type: 'mountain',
    coordinates: [84.0000, 28.0000],
    description: 'World\'s highest mountain range',
    upscRelevance: 'Physical geography, climate, biodiversity',
    importance: 'high',
    category: 'Physical Geography',
    examFrequency: 88,
    relatedTopics: ['Mountain Systems', 'Climate', 'Biodiversity']
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans National Park',
    type: 'national_park',
    coordinates: [89.1833, 21.9497],
    description: 'Largest mangrove forest, UNESCO World Heritage Site',
    upscRelevance: 'Biodiversity, conservation, climate change',
    importance: 'high',
    category: 'Environmental Geography',
    examFrequency: 80,
    relatedTopics: ['Biodiversity', 'Conservation', 'Climate Change']
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    type: 'historical_site',
    coordinates: [77.2410, 28.6562],
    description: 'Mughal fortress, UNESCO World Heritage Site',
    upscRelevance: 'Medieval history, Mughal architecture',
    importance: 'high',
    category: 'Historical Geography',
    examFrequency: 75,
    relatedTopics: ['Medieval History', 'Architecture', 'Cultural Heritage']
  }
];

export default function MapboxInteractiveMap({
  height = '600px',
  showControls = true,
  showAIAssistant = true,
  initialCenter = [78.9629, 20.5937], // Center of India
  initialZoom = 4,
  mapStyle = 'mapbox://styles/mapbox/streets-v12'
}: MapboxInteractiveMapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'states' | 'rivers' | 'mountains' | 'parks'>('all');
  const [showLabels, setShowLabels] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: initialCenter[0],
    latitude: initialCenter[1],
    zoom: initialZoom
  });

  const mapRef = useRef<any>(null);

  // Mapbox access token - You'll need to set this in your environment variables
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidXBzYy1kYXNoYm9hcmQiLCJhIjoiY2x0ZXN0MTIzIn0.example';

  const getLocationIcon = (type: MapLocation['type']) => {
    switch (type) {
      case 'state': return <MapPin className="h-4 w-4" />;
      case 'capital': return <Star className="h-4 w-4" />;
      case 'river': return <Waves className="h-4 w-4" />;
      case 'mountain': return <Mountain className="h-4 w-4" />;
      case 'national_park': return <TreePine className="h-4 w-4" />;
      case 'historical_site': return <Landmark className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationColor = (importance: MapLocation['importance']) => {
    switch (importance) {
      case 'high': return 'bg-red-500 border-red-600 text-white';
      case 'medium': return 'bg-yellow-500 border-yellow-600 text-white';
      case 'low': return 'bg-green-500 border-green-600 text-white';
      default: return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const filteredLocations = indiaLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayer = activeLayer === 'all' ||
                        (activeLayer === 'states' && location.type === 'state') ||
                        (activeLayer === 'rivers' && location.type === 'river') ||
                        (activeLayer === 'mountains' && location.type === 'mountain') ||
                        (activeLayer === 'parks' && location.type === 'national_park');
    return matchesSearch && matchesLayer;
  });

  const handleLocationClick = useCallback((location: MapLocation) => {
    setSelectedLocation(location);
    setViewState(prev => ({
      ...prev,
      longitude: location.coordinates[0],
      latitude: location.coordinates[1],
      zoom: Math.max(prev.zoom, 8)
    }));
  }, []);

  const resetView = () => {
    setViewState({
      longitude: initialCenter[0],
      latitude: initialCenter[1],
      zoom: initialZoom
    });
    setSelectedLocation(null);
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map Container */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />
        <FullscreenControl position="top-right" />

        {/* Location Markers */}
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.coordinates[0]}
            latitude={location.coordinates[1]}
            anchor="bottom"
            onClick={() => handleLocationClick(location)}
          >
            <div
              className={`cursor-pointer transition-all duration-200 hover:scale-125 ${getLocationColor(location.importance)} rounded-full p-2 border-2 shadow-lg backdrop-blur-sm`}
              title={location.name}
            >
              {getLocationIcon(location.type)}
            </div>
          </Marker>
        ))}

        {/* Popup for selected location */}
        {selectedLocation && (
          <Popup
            longitude={selectedLocation.coordinates[0]}
            latitude={selectedLocation.coordinates[1]}
            anchor="top"
            onClose={() => setSelectedLocation(null)}
            closeButton={true}
            closeOnClick={false}
            className="max-w-sm"
          >
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1 rounded ${getLocationColor(selectedLocation.importance)}`}>
                  {getLocationIcon(selectedLocation.type)}
                </div>
                <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-blue-600">UPSC Relevance:</span>
                  <p className="text-xs text-gray-700">{selectedLocation.upscRelevance}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${getLocationColor(selectedLocation.importance)}`}>
                    {selectedLocation.importance.toUpperCase()}
                  </span>
                  {selectedLocation.examFrequency && (
                    <span className="text-xs text-gray-500">
                      Exam Frequency: {selectedLocation.examFrequency}%
                    </span>
                  )}
                </div>
                {selectedLocation.relatedTopics && (
                  <div>
                    <span className="text-xs font-medium text-green-600">Related Topics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLocation.relatedTopics.map((topic, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Control Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Layer Controls */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Layers</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'all', label: 'All', icon: Globe },
                { key: 'states', label: 'States', icon: MapPin },
                { key: 'rivers', label: 'Rivers', icon: Waves },
                { key: 'mountains', label: 'Mountains', icon: Mountain },
                { key: 'parks', label: 'Parks', icon: TreePine }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveLayer(key as any)}
                  className={`flex items-center justify-center p-2 rounded text-xs transition-colors ${
                    activeLayer === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {showLabels ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              Labels
            </button>
            <button
              onClick={resetView}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Map AI Assistant</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Ask me about any location on the map for UPSC-relevant information!
          </p>
          <button
            onClick={() => toast.success('AI Assistant integration coming soon!')}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI
          </button>
        </div>
      )}
    </div>
  );
}
