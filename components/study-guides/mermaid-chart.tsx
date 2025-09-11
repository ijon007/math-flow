'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface MermaidChartProps {
  chart: string;
  className?: string;
}

export function MermaidChart({ chart, className }: MermaidChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!chart) {
      setIsLoading(false);
      return;
    }

    const renderChart = async () => {
      console.log('MermaidChart: Starting render with chart:', chart);
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#00C48D',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#00A875',
            lineColor: '#00C48D',
            secondaryColor: '#f0fdf4',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#00C48D',
            textColor: '#1f2937',
            nodeTextColor: '#ffffff',
            nodeBorder: '#00A875',
            clusterBkg: '#f0fdf4',
            clusterBorder: '#00A875',
            defaultLinkColor: '#00C48D',
            titleColor: '#1f2937',
            edgeLabelBackground: '#ffffff'
          }
        });

        // Generate unique ID
        const chartId = `mermaid-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Render the chart
        const { svg } = await mermaid.render(chartId, chart);
        
        // Insert SVG into the container
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
        }

      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render chart');
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-64 bg-muted/20 rounded-lg", className)}>
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg", className)}>
        <div className="text-red-600 text-center">
          <div className="font-medium">Chart Error</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", isFullscreen && "fixed inset-0 z-50 bg-white")}>
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: true }}
        panning={{ disabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            {/* Controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => zoomOut()}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => zoomIn()}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => resetTransform()}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Chart Container */}
            <TransformComponent
              wrapperClass="!w-full !h-full border rounded-lg"
              contentClass="!w-full !h-full"
            >
              <div 
                ref={chartRef} 
                className={cn(
                  "w-full flex items-center justify-center",
                  isFullscreen ? "h-screen" : "h-screen"
                )}
                style={{ 
                  minHeight: isFullscreen ? '100vh' : '50vh',
                  maxHeight: isFullscreen ? 'none' : '80vh'
                }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-muted-foreground">
        <div>• Mouse wheel to zoom</div>
        <div>• Drag to pan</div>
        <div>• Use controls to reset</div>
      </div>
    </div>
  );
}
