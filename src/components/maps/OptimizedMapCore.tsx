'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { OptimizedLocation } from '@/data/optimizedMapData';

// Using the optimized location interface from data file

// Pre-computed search indices for O(1) lookups
interface SearchIndex {
  byName: Map<string, OptimizedLocation[]>;
  byType: Map<string, OptimizedLocation[]>;
  byImportance: Map<string, OptimizedLocation[]>;
  searchTerms: Map<string, OptimizedLocation[]>;
}

// Lightweight map renderer without external dependencies
class FastMapRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private isDragging: boolean = false;
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Mouse events for pan and zoom
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.lastMousePos = { x: e.clientX, y: e.clientY };
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.lastMousePos.x;
    const deltaY = e.clientY - this.lastMousePos.y;
    
    this.offsetX += deltaX;
    this.offsetY += deltaY;
    
    this.lastMousePos = { x: e.clientX, y: e.clientY };
    this.render();
  }

  private handleMouseUp() {
    this.isDragging = false;
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.scale *= zoomFactor;
    this.scale = Math.max(0.5, Math.min(5, this.scale));
    this.render();
  }

  private handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.isDragging = true;
      this.lastMousePos = { x: touch.clientX, y: touch.clientY };
    }
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1 && this.isDragging) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.lastMousePos.x;
      const deltaY = touch.clientY - this.lastMousePos.y;
      
      this.offsetX += deltaX;
      this.offsetY += deltaY;
      
      this.lastMousePos = { x: touch.clientX, y: touch.clientY };
      this.render();
    }
  }

  private handleTouchEnd() {
    this.isDragging = false;
  }

  // Convert lat/lng to canvas coordinates
  private latLngToCanvas(lat: number, lng: number): [number, number] {
    // Simple mercator projection for India region
    const x = ((lng + 180) / 360) * this.width * this.scale + this.offsetX;
    const y = ((90 - lat) / 180) * this.height * this.scale + this.offsetY;
    return [x, y];
  }

  // Render the map and locations
  render(locations: OptimizedLocation[] = []) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw India outline (simplified)
    this.drawIndiaOutline();
    
    // Draw locations
    locations.forEach(location => {
      this.drawLocation(location);
    });
  }

  private drawIndiaOutline() {
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    // Simplified India border coordinates
    const indiaOutline = [
      [35.5, 68.1], [35.5, 97.4], [6.7, 97.4], [6.7, 68.1], [35.5, 68.1]
    ];
    
    indiaOutline.forEach(([lat, lng], index) => {
      const [x, y] = this.latLngToCanvas(lat, lng);
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    
    this.ctx.stroke();
  }

  private drawLocation(location: OptimizedLocation) {
    const [x, y] = this.latLngToCanvas(location.coords[0], location.coords[1]);
    
    // Skip if outside visible area
    if (x < -20 || x > this.width + 20 || y < -20 || y > this.height + 20) {
      return;
    }
    
    // Color based on importance
    const colors = {
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#10b981'
    };
    
    this.ctx.fillStyle = colors[location.importance];
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    
    // Draw marker
    this.ctx.beginPath();
    this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw label if zoomed in enough
    if (this.scale > 1.5) {
      this.ctx.fillStyle = '#374151';
      this.ctx.font = '12px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(location.name, x, y - 10);
    }
  }

  // Get location at canvas coordinates
  getLocationAt(x: number, y: number, locations: OptimizedLocation[]): OptimizedLocation | null {
    for (const location of locations) {
      const [locX, locY] = this.latLngToCanvas(location.coords[0], location.coords[1]);
      const distance = Math.sqrt((x - locX) ** 2 + (y - locY) ** 2);
      if (distance <= 10) {
        return location;
      }
    }
    return null;
  }

  // Center map on India
  centerOnIndia() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.render();
  }

  // Resize canvas
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }
}

interface OptimizedMapCoreProps {
  locations: OptimizedLocation[];
  onLocationClick?: (location: OptimizedLocation) => void;
  height?: string;
}

export default function OptimizedMapCore({ 
  locations, 
  onLocationClick, 
  height = '600px' 
}: OptimizedMapCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FastMapRenderer | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.parentElement!.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    rendererRef.current = new FastMapRenderer(canvas);
    rendererRef.current.centerOnIndia();
    setIsInitialized(true);

    // Handle canvas clicks
    const handleClick = (e: MouseEvent) => {
      if (!rendererRef.current || !onLocationClick) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const location = rendererRef.current.getLocationAt(x, y, locations);
      if (location) {
        onLocationClick(location);
      }
    };

    canvas.addEventListener('click', handleClick);

    // Handle resize
    const handleResize = () => {
      if (!rendererRef.current) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      rendererRef.current.resize(rect.width, rect.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [onLocationClick]);

  // Render locations when they change
  useEffect(() => {
    if (rendererRef.current && isInitialized) {
      rendererRef.current.render(locations);
    }
  }, [locations, isInitialized]);

  return (
    <div className="relative w-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 cursor-move"
        style={{ touchAction: 'none' }}
      />
      
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Initializing map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export utility functions for data optimization
export const optimizeLocationData = (locations: MapLocation[]): OptimizedLocation[] => {
  return locations.map(loc => ({
    id: loc.id,
    name: loc.name,
    type: loc.type,
    coords: loc.coordinates,
    desc: loc.description,
    relevance: loc.upscRelevance,
    importance: loc.importance,
    freq: loc.examFrequency,
    topics: loc.relatedTopics
  }));
};

export const createSearchIndex = (locations: OptimizedLocation[]): SearchIndex => {
  const index: SearchIndex = {
    byName: new Map(),
    byType: new Map(),
    byImportance: new Map(),
    searchTerms: new Map()
  };

  locations.forEach(location => {
    // Index by name
    const nameKey = location.name.toLowerCase();
    if (!index.byName.has(nameKey)) {
      index.byName.set(nameKey, []);
    }
    index.byName.get(nameKey)!.push(location);

    // Index by type
    if (!index.byType.has(location.type)) {
      index.byType.set(location.type, []);
    }
    index.byType.get(location.type)!.push(location);

    // Index by importance
    if (!index.byImportance.has(location.importance)) {
      index.byImportance.set(location.importance, []);
    }
    index.byImportance.get(location.importance)!.push(location);

    // Index search terms
    const searchTerms = [
      ...location.name.toLowerCase().split(' '),
      ...location.desc.toLowerCase().split(' '),
      ...location.relevance.toLowerCase().split(' '),
      ...(location.topics || []).map(t => t.toLowerCase())
    ];

    searchTerms.forEach(term => {
      if (term.length > 2) {
        if (!index.searchTerms.has(term)) {
          index.searchTerms.set(term, []);
        }
        if (!index.searchTerms.get(term)!.includes(location)) {
          index.searchTerms.get(term)!.push(location);
        }
      }
    });
  });

  return index;
};
