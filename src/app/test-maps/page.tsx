'use client';

import React from 'react';
import { optimizedIndiaLocations, searchLocations } from '@/data/optimizedMapData';

export default function TestMapsPage() {
  const testSearch = () => {
    const results = searchLocations('ganges');
    console.log('Search results for "ganges":', results);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Maps Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Data Test</h2>
          <p>Total locations: {optimizedIndiaLocations.length}</p>
          <button 
            onClick={testSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Search Function
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Sample Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {optimizedIndiaLocations.slice(0, 4).map((location) => (
              <div key={location.id} className="border p-4 rounded">
                <h3 className="font-medium">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.type}</p>
                <p className="text-xs text-gray-500">{location.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <a 
            href="/maps" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Full Maps Page
          </a>
        </div>
      </div>
    </div>
  );
}
