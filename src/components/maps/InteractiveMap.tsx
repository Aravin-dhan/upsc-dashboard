'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin, Layers, Search, Brain, MessageCircle, Globe, ZoomIn, ZoomOut,
  Navigation, Info, Star, Mountain, Waves, TreePine, Factory, Landmark,
  Filter, RotateCcw
} from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  type: 'state' | 'capital' | 'river' | 'mountain' | 'national_park' | 'historical_site';
  coordinates: { x: number; y: number };
  description: string;
  upscRelevance: string;
  importance: 'high' | 'medium' | 'low';
}

interface InteractiveMapProps {
  height?: string;
  showControls?: boolean;
  showAIAssistant?: boolean;
}

export default function InteractiveMap({
  height = '600px',
  showControls = true,
  showAIAssistant = true
}: InteractiveMapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<'all' | 'states' | 'rivers' | 'mountains' | 'parks'>('all');
  const mapRef = useRef<HTMLDivElement>(null);

  // Sample UPSC-relevant locations
  const locations: MapLocation[] = [
    {
      id: '1',
      name: 'Kashmir Valley',
      type: 'state',
      coordinates: { x: 300, y: 100 },
      description: 'Strategically important region with ongoing geopolitical significance',
      upscRelevance: 'Article 370, Line of Control, China-Pakistan Economic Corridor',
      importance: 'high'
    },
    {
      id: '2',
      name: 'Ganga River',
      type: 'river',
      coordinates: { x: 400, y: 200 },
      description: 'Sacred river and lifeline of northern India',
      upscRelevance: 'Namami Gange, river interlinking, water disputes',
      importance: 'high'
    },
    {
      id: '3',
      name: 'Western Ghats',
      type: 'mountain',
      coordinates: { x: 250, y: 350 },
      description: 'UNESCO World Heritage Site and biodiversity hotspot',
      upscRelevance: 'Environmental protection, Gadgil Committee, Kasturirangan Committee',
      importance: 'high'
    },
    {
      id: '4',
      name: 'Sundarbans',
      type: 'national_park',
      coordinates: { x: 500, y: 280 },
      description: 'Largest mangrove forest and tiger reserve',
      upscRelevance: 'Climate change, tiger conservation, Indo-Bangladesh relations',
      importance: 'medium'
    },
    {
      id: '5',
      name: 'Red Fort',
      type: 'historical_site',
      coordinates: { x: 380, y: 180 },
      description: 'Mughal architecture and symbol of Indian independence',
      upscRelevance: 'Independence Day, Mughal history, cultural heritage',
      importance: 'medium'
    }
  ];

  const getLocationIcon = (type: string) => {
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

  const getLocationColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayer = activeLayer === 'all' ||
                        (activeLayer === 'states' && location.type === 'state') ||
                        (activeLayer === 'rivers' && location.type === 'river') ||
                        (activeLayer === 'mountains' && location.type === 'mountain') ||
                        (activeLayer === 'parks' && location.type === 'national_park');
    return matchesSearch && matchesLayer;
  });

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M200 100 L250 80 L300 85 L350 90 L400 95 L450 105 L500 120 L550 140 L580 170 L600 200 L610 240 L600 280 L580 320 L550 350 L500 370 L450 380 L400 385 L350 380 L300 370 L250 350 L220 320 L200 280 L180 240 L170 200 L180 160 L190 130 Z' fill='%2334d399' fill-opacity='0.1' stroke='%2334d399' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#f8fafc'
        }}
      >
        {/* Static India Map Background */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M200 100 L250 80 L300 85 L350 90 L400 95 L450 105 L500 120 L550 140 L580 170 L600 200 L610 240 L600 280 L580 320 L550 350 L500 370 L450 380 L400 385 L 350 380 L300 370 L250 350 L220 320 L200 280 L180 240 L170 200 L180 160 L190 130 Z' fill='none' stroke='%2334d399' stroke-width='3'/%3E%3Ctext x='400' y='50' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%23374151'%3EINDIA%3C/text%3E%3Ctext x='150' y='150' font-family='Arial' font-size='12' fill='%23374151'%3EArabian Sea%3C/text%3E%3Ctext x='550' y='150' font-family='Arial' font-size='12' fill='%23374151'%3EBay of Bengal%3C/text%3E%3Ctext x='400' y='450' text-anchor='middle' font-family='Arial' font-size='12' fill='%23374151'%3EIndian Ocean%3C/text%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Interactive Location Markers */}
        {filteredLocations.map((location) => (
          <div
            key={`marker-${location.id}`}
            className={`absolute cursor-pointer transition-all duration-200 hover:scale-125 hover:z-10 ${getLocationColor(location.importance)} rounded-full p-3 border-2 shadow-lg backdrop-blur-sm`}
            style={{
              left: `${(location.coordinates.x / 800) * 100}%`,
              top: `${(location.coordinates.y / 600) * 100}%`,
              transform: `translate(-50%, -50%) scale(${zoom})`,
              zIndex: selectedLocation?.id === location.id ? 20 : 10
            }}
            onClick={() => setSelectedLocation(location)}
            title={location.name}
          >
            {getLocationIcon(location.type)}
          </div>
        ))}

        {/* Location Labels */}
        {filteredLocations.map((location) => (
          <div
            key={`label-${location.id}`}
            className="absolute pointer-events-none text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm border"
            style={{
              left: `${(location.coordinates.x / 800) * 100}%`,
              top: `${(location.coordinates.y / 600) * 100 - 8}%`,
              transform: `translate(-50%, -100%) scale(${Math.min(zoom, 1.2)})`,
              opacity: zoom > 0.8 ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            {location.name}
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <>
          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Layer Controls */}
              <select
                value={activeLayer}
                onChange={(e) => setActiveLayer(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Layers</option>
                <option value="states">States</option>
                <option value="rivers">Rivers</option>
                <option value="mountains">Mountains</option>
                <option value="parks">National Parks</option>
              </select>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-20 right-4 z-10 flex flex-col space-y-2">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Reset View"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
                <span className="text-gray-600 dark:text-gray-400">High Importance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></div>
                <span className="text-gray-600 dark:text-gray-400">Medium Importance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
                <span className="text-gray-600 dark:text-gray-400">Low Importance</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Location Information Panel */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 z-20 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${getLocationColor(selectedLocation.importance)}`}>
                {getLocationIcon(selectedLocation.type)}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedLocation.name}</h3>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLocation.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UPSC Relevance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLocation.upscRelevance}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className={`px-2 py-1 text-xs rounded-full ${getLocationColor(selectedLocation.importance)}`}>
                {selectedLocation.importance.charAt(0).toUpperCase() + selectedLocation.importance.slice(1)} Priority
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {selectedLocation.type.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div>Locations: {filteredLocations.length}</div>
          <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}
