'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Download, Share2, Edit, 
  Plus, Minus, Move, MousePointer, Type, Image as ImageIcon,
  Save, Undo, Redo, Palette, Settings
} from 'lucide-react';

interface MindmapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  level: number;
  parentId?: string;
  children: string[];
  color: string;
  shape: 'rectangle' | 'circle' | 'diamond' | 'hexagon';
  fontSize: number;
  width: number;
  height: number;
  collapsed: boolean;
}

interface MindmapConnection {
  id: string;
  fromId: string;
  toId: string;
  style: 'straight' | 'curved' | 'zigzag';
  color: string;
  thickness: number;
}

interface MindmapData {
  nodes: MindmapNode[];
  connections: MindmapConnection[];
  title: string;
  description?: string;
  theme: 'default' | 'dark' | 'colorful' | 'minimal';
}

interface MindmapViewerProps {
  data?: MindmapData;
  width?: number;
  height?: number;
  editable?: boolean;
  onSave?: (data: MindmapData) => void;
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
}

export default function MindmapViewer({
  data,
  width = 800,
  height = 600,
  editable = false,
  onSave,
  onExport
}: MindmapViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mindmapData, setMindmapData] = useState<MindmapData>(
    data || getDefaultMindmapData()
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'add' | 'connect' | 'text'>('select');
  const [showToolbar, setShowToolbar] = useState(true);

  // Default mindmap data for UPSC topics
  function getDefaultMindmapData(): MindmapData {
    return {
      title: 'UPSC Preparation Strategy',
      description: 'Comprehensive approach to UPSC Civil Services Examination',
      theme: 'default',
      nodes: [
        {
          id: 'root',
          text: 'UPSC CSE',
          x: 400,
          y: 300,
          level: 0,
          children: ['prelims', 'mains', 'interview'],
          color: '#3B82F6',
          shape: 'circle',
          fontSize: 18,
          width: 120,
          height: 60,
          collapsed: false
        },
        {
          id: 'prelims',
          text: 'Prelims',
          x: 200,
          y: 200,
          level: 1,
          parentId: 'root',
          children: ['gs1', 'csat'],
          color: '#10B981',
          shape: 'rectangle',
          fontSize: 14,
          width: 100,
          height: 50,
          collapsed: false
        },
        {
          id: 'mains',
          text: 'Mains',
          x: 400,
          y: 150,
          level: 1,
          parentId: 'root',
          children: ['essay', 'gs-papers', 'optional'],
          color: '#F59E0B',
          shape: 'rectangle',
          fontSize: 14,
          width: 100,
          height: 50,
          collapsed: false
        },
        {
          id: 'interview',
          text: 'Interview',
          x: 600,
          y: 200,
          level: 1,
          parentId: 'root',
          children: ['personality', 'current-affairs'],
          color: '#EF4444',
          shape: 'rectangle',
          fontSize: 14,
          width: 100,
          height: 50,
          collapsed: false
        },
        {
          id: 'gs1',
          text: 'GS Paper 1',
          x: 100,
          y: 100,
          level: 2,
          parentId: 'prelims',
          children: [],
          color: '#8B5CF6',
          shape: 'rectangle',
          fontSize: 12,
          width: 80,
          height: 40,
          collapsed: false
        },
        {
          id: 'csat',
          text: 'CSAT',
          x: 300,
          y: 100,
          level: 2,
          parentId: 'prelims',
          children: [],
          color: '#06B6D4',
          shape: 'rectangle',
          fontSize: 12,
          width: 80,
          height: 40,
          collapsed: false
        }
      ],
      connections: [
        { id: 'c1', fromId: 'root', toId: 'prelims', style: 'curved', color: '#6B7280', thickness: 2 },
        { id: 'c2', fromId: 'root', toId: 'mains', style: 'curved', color: '#6B7280', thickness: 2 },
        { id: 'c3', fromId: 'root', toId: 'interview', style: 'curved', color: '#6B7280', thickness: 2 },
        { id: 'c4', fromId: 'prelims', toId: 'gs1', style: 'curved', color: '#6B7280', thickness: 1 },
        { id: 'c5', fromId: 'prelims', toId: 'csat', style: 'curved', color: '#6B7280', thickness: 1 }
      ]
    };
  }

  // Canvas drawing functions
  const drawNode = (ctx: CanvasRenderingContext2D, node: MindmapNode) => {
    const x = (node.x + pan.x) * zoom;
    const y = (node.y + pan.y) * zoom;
    const width = node.width * zoom;
    const height = node.height * zoom;

    // Draw node background
    ctx.fillStyle = node.color;
    ctx.strokeStyle = selectedNode === node.id ? '#000000' : '#FFFFFF';
    ctx.lineWidth = selectedNode === node.id ? 3 : 1;

    switch (node.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, Math.max(width, height) / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      case 'rectangle':
        ctx.fillRect(x - width/2, y - height/2, width, height);
        ctx.strokeRect(x - width/2, y - height/2, width, height);
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(x, y - height/2);
        ctx.lineTo(x + width/2, y);
        ctx.lineTo(x, y + height/2);
        ctx.lineTo(x - width/2, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }

    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${node.fontSize * zoom}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.text, x, y);
  };

  const drawConnection = (ctx: CanvasRenderingContext2D, connection: MindmapConnection) => {
    if (!mindmapData?.nodes || !Array.isArray(mindmapData.nodes)) return;

    const fromNode = mindmapData.nodes.find(n => n.id === connection.fromId);
    const toNode = mindmapData.nodes.find(n => n.id === connection.toId);

    if (!fromNode || !toNode) return;

    const fromX = (fromNode.x + pan.x) * zoom;
    const fromY = (fromNode.y + pan.y) * zoom;
    const toX = (toNode.x + pan.x) * zoom;
    const toY = (toNode.y + pan.y) * zoom;

    ctx.strokeStyle = connection.color;
    ctx.lineWidth = connection.thickness;
    ctx.beginPath();

    switch (connection.style) {
      case 'straight':
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        break;
      case 'curved':
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const controlX = midX + (fromY - toY) * 0.2;
        const controlY = midY + (toX - fromX) * 0.2;
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(controlX, controlY, toX, toY);
        break;
    }
    ctx.stroke();
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first (behind nodes) - with null/undefined check
    if (mindmapData?.connections && Array.isArray(mindmapData.connections)) {
      mindmapData.connections.forEach(connection => {
        drawConnection(ctx, connection);
      });
    }

    // Draw nodes - with null/undefined check
    if (mindmapData?.nodes && Array.isArray(mindmapData.nodes)) {
      mindmapData.nodes.forEach(node => {
        if (!node.collapsed) {
          drawNode(ctx, node);
        }
      });
    }
  };

  // Event handlers
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    // Find clicked node - with null/undefined check
    const clickedNode = mindmapData?.nodes && Array.isArray(mindmapData.nodes)
      ? mindmapData.nodes.find(node => {
          const dx = x - node.x;
          const dy = y - node.y;
          return Math.abs(dx) < node.width/2 && Math.abs(dy) < node.height/2;
        })
      : null;

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    } else {
      setSelectedNode(null);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const handleExport = (format: 'png' | 'svg' | 'pdf') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export to PNG
      const canvas = canvasRef.current;
      if (canvas && format === 'png') {
        const link = document.createElement('a');
        link.download = `${mindmapData.title.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      redraw();
    }
  }, [mindmapData, zoom, pan, selectedNode, width, height]);

  return (
    <div ref={containerRef} className="relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      {showToolbar && (
        <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <button
              onClick={() => handleExport('png')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Export as PNG"
            >
              <Download className="h-4 w-4" />
            </button>
            {editable && (
              <>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button
                  onClick={() => setTool('select')}
                  className={`p-2 rounded ${tool === 'select' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Select Tool"
                >
                  <MousePointer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool('add')}
                  className={`p-2 rounded ${tool === 'add' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Add Node"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTool('text')}
                  className={`p-2 rounded ${tool === 'text' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Edit Text"
                >
                  <Type className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="cursor-crosshair"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Info Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
          {(() => {
            const node = mindmapData?.nodes && Array.isArray(mindmapData.nodes)
              ? mindmapData.nodes.find(n => n.id === selectedNode)
              : null;
            return node ? (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{node.text}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Level: {node.level}</div>
                  <div>Shape: {node.shape}</div>
                  <div>Children: {node.children?.length || 0}</div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}
