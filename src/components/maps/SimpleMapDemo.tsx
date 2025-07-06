'use client';

import React, { useState } from 'react';
import { MapPin, Search, Brain, MessageCircle, Star } from 'lucide-react';
import { optimizedIndiaLocations, searchLocations, OptimizedLocation } from '@/data/optimizedMapData';

interface SimpleMapDemoProps {
  height?: string;
}

export default function SimpleMapDemo({ height = '500px' }: SimpleMapDemoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<OptimizedLocation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const filteredLocations = searchTerm
    ? searchLocations(searchTerm)
    : optimizedIndiaLocations;

  const typeFilteredLocations = filterType === 'all'
    ? filteredLocations
    : filteredLocations.filter(loc => loc.type === filterType);

  const uniqueTypes = Array.from(new Set(optimizedIndiaLocations.map(loc => loc.type)));

  return (
    <div className="w-full" style={{ height }}>
      {/* Enhanced Search and Filter Bar */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showAIAssistant
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-2" />
            AI Assistant
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {typeFilteredLocations.length} of {optimizedIndiaLocations.length} locations
        </div>
      </div>

      {/* Simple Map Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100% - 80px)' }}>
        {/* Map Area */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Interactive India Map
            </h3>
            
            {/* Optimized Static Map with Interactive Overlays */}
            <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 dark:from-blue-900 dark:via-green-900 dark:to-yellow-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              {/* Static India Map SVG Outline */}
              <svg
                viewBox="0 0 400 300"
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
              >
                {/* Simplified India outline */}
                <path
                  d="M80 50 L120 40 L160 45 L200 50 L240 60 L280 80 L320 120 L340 160 L350 200 L340 240 L320 260 L280 270 L240 275 L200 270 L160 265 L120 250 L100 220 L90 180 L85 140 L80 100 Z"
                  fill="rgba(34, 197, 94, 0.3)"
                  stroke="rgba(34, 197, 94, 0.8)"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:fill-opacity-50"
                />

                {/* Major geographical features */}
                <circle cx="200" cy="120" r="3" fill="#3B82F6" title="Himalayas" />
                <path d="M120 180 Q200 190 280 185" stroke="#06B6D4" strokeWidth="2" fill="none" title="Ganges" />
                <circle cx="150" cy="200" r="2" fill="#F59E0B" title="Thar Desert" />
                <circle cx="250" cy="220" r="2" fill="#10B981" title="Deccan Plateau" />
              </svg>

              {/* Interactive Location Markers */}
              {typeFilteredLocations.slice(0, 12).map((location, index) => {
                // Calculate position based on actual coordinates (simplified projection)
                const x = ((location.coords[1] - 68) / (97 - 68)) * 100; // Longitude to %
                const y = ((35 - location.coords[0]) / (35 - 8)) * 100; // Latitude to % (inverted)

                return (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 ${
                      location.importance === 'high'
                        ? 'w-4 h-4 bg-red-500 hover:bg-red-600'
                        : location.importance === 'medium'
                        ? 'w-3 h-3 bg-orange-500 hover:bg-orange-600'
                        : 'w-2 h-2 bg-yellow-500 hover:bg-yellow-600'
                    } rounded-full shadow-lg border-2 border-white dark:border-gray-800`}
                    style={{
                      left: `${Math.max(10, Math.min(90, x))}%`,
                      top: `${Math.max(10, Math.min(90, y))}%`,
                      zIndex: location.importance === 'high' ? 30 : location.importance === 'medium' ? 20 : 10
                    }}
                    title={`${location.name} (${location.type})`}
                  >
                    <span className="sr-only">{location.name}</span>
                  </button>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs space-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">High Priority</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 ml-0.5"></div>
                    <span className="text-gray-700 dark:text-gray-300">Medium Priority</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 ml-0.5"></div>
                    <span className="text-gray-700 dark:text-gray-300">Low Priority</span>
                  </div>
                </div>
              </div>

              {/* Location count indicator */}
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                {typeFilteredLocations.length} locations
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Click on red markers to view location details
            </p>
          </div>

          {/* AI Assistant Panel */}
          {showAIAssistant && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Geography Assistant</h3>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Click on any location to get detailed UPSC-relevant information and study tips.
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask Geography Question
                </button>
                {selectedLocation && (
                  <button className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze {selectedLocation.name}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Locations List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Locations ({typeFilteredLocations.length})
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {typeFilteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 mt-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{location.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.desc}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.importance === 'high' ? 'bg-red-100 text-red-700' :
                        location.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {location.importance}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {location.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {typeFilteredLocations.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No locations found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 dark:text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedLocation.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{selectedLocation.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedLocation.desc}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">UPSC Relevance</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedLocation.relevance}</p>
                </div>

                {selectedLocation.topics && selectedLocation.topics.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedLocation.importance === 'high' ? 'bg-red-100 text-red-700' :
                    selectedLocation.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedLocation.importance} importance
                  </span>
                  {selectedLocation.freq && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedLocation.freq}% exam frequency
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
