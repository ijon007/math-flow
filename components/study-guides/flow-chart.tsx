'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Target,
  Calculator,
  Play,
  Eye,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowChartNode {
  id: string;
  label: string;
  type: string;
  position: { x: number; y: number };
}

interface FlowChartEdge {
  source: string;
  target: string;
  type: string;
}

interface FlowChartProps {
  nodes: FlowChartNode[];
  edges: FlowChartEdge[];
  onNodeClick?: (nodeId: string) => void;
  completedSteps?: string[];
  currentStep?: string;
  className?: string;
}

export function FlowChart({ 
  nodes, 
  edges, 
  onNodeClick, 
  completedSteps = [], 
  currentStep,
  className 
}: FlowChartProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'concept':
        return <Target className="h-4 w-4" />;
      case 'example':
        return <Calculator className="h-4 w-4" />;
      case 'practice':
        return <Play className="h-4 w-4" />;
      case 'visualization':
        return <Eye className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getNodeStatus = (nodeId: string) => {
    if (completedSteps.includes(nodeId)) return 'completed';
    if (currentStep === nodeId) return 'current';
    return 'pending';
  };

  const getNodeColor = (status: string, type: string) => {
    if (status === 'completed') return 'bg-green-500 text-white';
    if (status === 'current') return 'bg-blue-500 text-white';
    
    switch (type) {
      case 'concept':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'example':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'practice':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'visualization':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
  };

  // Calculate viewport dimensions
  const viewBox = {
    x: -pan.x / zoom,
    y: -pan.y / zoom,
    width: 800 / zoom,
    height: 600 / zoom
  };

  return (
    <Card className={cn("relative", className, isFullscreen && "fixed inset-0 z-50")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Learning Flow</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.3}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div 
          className="relative overflow-hidden bg-muted/20 rounded-lg"
          style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            className="cursor-grab active:cursor-grabbing"
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {edges.map((edge, index) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              
              if (!sourceNode || !targetNode) return null;

              const isCompleted = completedSteps.includes(edge.source) && completedSteps.includes(edge.target);
              const isCurrent = currentStep === edge.source || currentStep === edge.target;

              return (
                <g key={index}>
                  <line
                    x1={sourceNode.position.x}
                    y1={sourceNode.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#6b7280'}
                    strokeWidth={isCompleted ? 3 : isCurrent ? 2 : 1}
                    strokeDasharray={isCompleted ? 'none' : '5,5'}
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Arrow marker */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#6b7280'}
                      />
                    </marker>
                  </defs>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const status = getNodeStatus(node.id);
              const isClickable = !!onNodeClick;
              
              // Calculate dynamic width based on text length
              const textWidth = Math.max(node.label.length * 8, 120); // 8px per character, minimum 120px
              const cardWidth = textWidth + 40; // Add padding
              const cardHeight = 50; // Increased height
              const cardX = node.position.x - (cardWidth / 2);
              const cardY = node.position.y - (cardHeight / 2);
              
              return (
                <g key={node.id}>
                  {/* Node background */}
                  <rect
                    x={cardX}
                    y={cardY}
                    width={cardWidth}
                    height={cardHeight}
                    rx="8"
                    fill="white"
                    stroke={status === 'completed' ? '#10b981' : status === 'current' ? '#3b82f6' : '#d1d5db'}
                    strokeWidth={status === 'current' ? 3 : 2}
                    className={cn(
                      isClickable && "cursor-pointer hover:shadow-md transition-all",
                      status === 'completed' && "shadow-lg"
                    )}
                    onClick={() => isClickable && handleNodeClick(node.id)}
                  />
                  
                  {/* Node content */}
                  <g transform={`translate(${node.position.x}, ${node.position.y})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm font-medium fill-current"
                      fill={status === 'completed' ? 'white' : status === 'current' ? 'white' : 'currentColor'}
                    >
                      {node.label}
                    </text>
                  </g>

                  {/* Node icon - positioned at top left */}
                  <g transform={`translate(${cardX + 8}, ${cardY + 8})`}>
                    <foreignObject width="20" height="20">
                      <div className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full",
                        getNodeColor(status, node.type)
                      )}>
                        {getNodeIcon(node.type)}
                      </div>
                    </foreignObject>
                  </g>

                  {/* Status indicator - positioned at top right */}
                  {status === 'completed' && (
                    <g transform={`translate(${cardX + cardWidth - 28}, ${cardY + 8})`}>
                      <foreignObject width="20" height="20">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      </foreignObject>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs font-medium mb-2">Node Types</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
                <span className="text-xs">Concepts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300"></div>
                <span className="text-xs">Examples</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
                <span className="text-xs">Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-100 border border-cyan-300"></div>
                <span className="text-xs">Visualizations</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs text-muted-foreground">
              <div>• Drag to pan</div>
              <div>• Use zoom controls</div>
              <div>• Click nodes to navigate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
