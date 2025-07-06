'use client';

import React from 'react';
import { MapLocation } from '@/data/indiaMapData';

interface CustomMarkerProps {
  location: MapLocation;
  onClick?: (location: MapLocation) => void;
}

// Simple fallback component while we fix the Leaflet installation
export default function CustomMarker({ location, onClick }: CustomMarkerProps) {
  return (
    <div className="inline-block p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm">
      <div className="font-medium text-blue-800 dark:text-blue-200">{location.name}</div>
      <div className="text-xs text-blue-600 dark:text-blue-400">{location.type}</div>
    </div>
  );
}
