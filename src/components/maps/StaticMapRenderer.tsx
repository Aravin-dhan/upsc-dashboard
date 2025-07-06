'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Search, Filter, Eye, Star } from 'lucide-react';
import { optimizedIndiaLocations, searchLocations, OptimizedLocation } from '@/data/optimizedMapData';

interface StaticMapRendererProps {
  height?: string;
  showSearch?: boolean;
  maxLocations?: number;
}

export default function StaticMapRenderer({ 
  height = '400px', 
  showSearch = true, 
  maxLocations = 20 
}: StaticMapRendererProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<OptimizedLocation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Optimized filtering with memoization
  const filteredLocations = useMemo(() => {
    let locations = searchTerm ? searchLocations(searchTerm) : optimizedIndiaLocations;
    if (filterType !== 'all') {
      locations = locations.filter(loc => loc.type === filterType);
    }
    return locations.slice(0, maxLocations);
  }, [searchTerm, filterType, maxLocations]);

  const uniqueTypes = useMemo(() => 
    Array.from(new Set(optimizedIndiaLocations.map(loc => loc.type))), 
    []
  );

  // Coordinate projection function (optimized)
  const projectCoordinates = (coords: [number, number]) => {
    const [lat, lng] = coords;
    const x = ((lng - 68) / (97 - 68)) * 100;
    const y = ((35 - lat) / (35 - 8)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  return (
    <div className="w-full" style={{ height }}>
      {/* Compact Search Bar */}
      {showSearch && (
        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Ultra-Lightweight Static Map */}
      <div className="relative w-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
           style={{ height: showSearch ? 'calc(100% - 60px)' : '100%' }}>
        
        {/* Pure CSS India Map Outline */}
        <div 
          className="absolute inset-4 bg-green-200 dark:bg-green-700 opacity-60 rounded-lg"
          style={{
            clipPath: 'polygon(20% 15%, 30% 10%, 40% 12%, 50% 15%, 60% 18%, 70% 25%, 80% 35%, 85% 50%, 87% 65%, 85% 80%, 80% 87%, 70% 90%, 60% 92%, 50% 90%, 40% 88%, 30% 82%, 25% 70%, 22% 55%, 21% 40%, 20% 25%)'
          }}
        />

        {/* Geographical Features (CSS-only) */}
        <div className="absolute top-8 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2" title="Himalayas" />
        <div className="absolute top-16 left-8 w-1 h-1 bg-yellow-500 rounded-full" title="Thar Desert" />
        <div className="absolute bottom-12 left-1/2 w-1.5 h-1.5 bg-green-600 rounded-full transform -translate-x-1/2" title="Deccan Plateau" />

        {/* Optimized Location Markers */}
        {filteredLocations.map((location) => {
          const { x, y } = projectCoordinates(location.coords);
          const markerSize = location.importance === 'high' ? 'w-3 h-3' : 
                           location.importance === 'medium' ? 'w-2.5 h-2.5' : 'w-2 h-2';
          const markerColor = location.importance === 'high' ? 'bg-red-500 hover:bg-red-600' :
                             location.importance === 'medium' ? 'bg-orange-500 hover:bg-orange-600' :
                             'bg-yellow-500 hover:bg-yellow-600';

          return (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className={`absolute ${markerSize} ${markerColor} rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 hover:scale-110 shadow-sm border border-white dark:border-gray-800`}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={location.name}
            />
          );
        })}

        {/* Compact Legend */}
        <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded px-2 py-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              <span className="text-gray-600 dark:text-gray-400">High</span>
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1"></div>
              <span className="text-gray-600 dark:text-gray-400">Med</span>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-1 bg-yellow-500 rounded-full mr-1"></div>
              <span className="text-gray-600 dark:text-gray-400">Low</span>
            </div>
          </div>
        </div>

        {/* Location Counter */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          {filteredLocations.length}
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                {selectedLocation.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {selectedLocation.desc}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  selectedLocation.importance === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  selectedLocation.importance === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {selectedLocation.importance}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedLocation.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
