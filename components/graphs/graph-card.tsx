'use client';

import { Calendar, Download, MoreHorizontal, Share, Trash2, Edit, Eye, ChartSpline } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FunctionGraph } from '@/components/charts/function-graph';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { LineChartComponent } from '@/components/charts/line-chart';
import { ScatterPlotComponent } from '@/components/charts/scatter-plot';
import { HistogramComponent } from '@/components/charts/histogram';
import { useState } from 'react';
import type { Graph } from '@/constants/graphs';
import { MathExpression } from '@/components/ui/math-expression';

interface GraphCardProps {
  graph: Graph;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

// Function to get graph data from the database graph object
function getGraphData(graph: Graph) {
  // If the graph has data property (from database), use it
  if (graph.data && Array.isArray(graph.data)) {
    return graph.data;
  }
  
  // Fallback: generate sample data for different graph types
  const data = [];
  const step = 0.1;
  
  switch (graph.type) {
    case 'function':
      // Generate function data based on equation
      for (let x = -5; x <= 5; x += step) {
        try {
          // Simple evaluation for common functions
          let y = 0;
          if (graph.equation.includes('x^2') || graph.equation.includes('x²')) {
            y = x * x;
          } else if (graph.equation.includes('sin')) {
            y = Math.sin(x);
          } else if (graph.equation.includes('cos')) {
            y = Math.cos(x);
          } else if (graph.equation.includes('log')) {
            y = Math.log(Math.abs(x) + 0.1);
          } else {
            y = x; // Default linear
          }
          data.push({ x, y });
        } catch (error) {
          data.push({ x, y: x });
        }
      }
      break;
    case 'bar':
    case 'line':
    case 'scatter':
    case 'histogram':
    case 'polar':
    case 'parametric':
      // For other types, return empty array or sample data
      return graph.data || [];
    default:
      // Default linear function
      for (let x = -5; x <= 5; x += step) {
        data.push({ x, y: x });
      }
  }
  
  return data;
}

// Function to render the appropriate chart component based on graph type
function renderGraphComponent(graph: Graph, graphData: any[]) {
  const commonConfig = {
    title: graph.title,
    xLabel: 'X',
    yLabel: 'Y',
    grid: true,
    ...graph.config
  };

  const commonMetadata = {
    ...graph.metadata
  };

  switch (graph.type) {
    case 'function':
      return (
        <FunctionGraph
          data={graphData}
          config={commonConfig}
          metadata={{
            expression: graph.equation,
            variable: 'x',
            domain: { min: -10, max: 10, step: 0.1 },
            ...commonMetadata
          }}
          fullView={true}
        />
      );
    case 'bar':
      return (
        <BarChartComponent
          data={graphData}
          config={commonConfig}
          metadata={commonMetadata}
        />
      );
    case 'line':
      return (
        <LineChartComponent
          data={graphData}
          config={commonConfig}
          metadata={commonMetadata}
        />
      );
    case 'scatter':
      return (
        <ScatterPlotComponent
          data={graphData}
          config={commonConfig}
          metadata={commonMetadata}
        />
      );
    case 'histogram':
      return (
        <HistogramComponent
          data={graphData}
          config={commonConfig}
          metadata={commonMetadata}
        />
      );
    case 'polar':
    case 'parametric':
      // For now, use FunctionGraph as fallback for polar and parametric
      return (
        <FunctionGraph
          data={graphData}
          config={commonConfig}
          metadata={{
            expression: graph.equation,
            variable: 'x',
            domain: { min: -10, max: 10, step: 0.1 },
            ...commonMetadata
          }}
          fullView={true}
        />
      );
    default:
      return (
        <FunctionGraph
          data={graphData}
          config={commonConfig}
          metadata={{
            expression: graph.equation,
            variable: 'x',
            domain: { min: -10, max: 10, step: 0.1 },
            ...commonMetadata
          }}
          fullView={true}
        />
      );
  }
}

export function GraphCard({ graph, onDelete, onShare, onDownload, onView }: GraphCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const graphData = getGraphData(graph);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div
        className="border border-neutral-200 rounded-lg bg-white group cursor-pointer hover:bg-neutral-50 transition-colors p-3"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-neutral-900 mb-1 truncate">
              {graph.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Calendar className="h-3 w-3" />
              <span>{graph.createdAt}</span>
              <Badge variant="outline" className="text-xs bg-[#00C48D]/10 text-[#00C48D] border-[#00C48D]/20">
                {graph.type}
              </Badge>
            </div>
          </div>
          <Button 
            size="icon"
            onClick={() => onDelete(graph.id)}
            variant="ghost"
            className='lg:opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-colors duration-200 size-7'
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-neutral-200/60 rounded-md p-3">
          <div className="text-sm text-neutral-700">
            <MathExpression 
              expression={graph.equation}
              inline={false}
            />
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl px-3 overflow-hidden">
          <DialogTitle className="sr-only text-lg font-semibold">{graph.title}</DialogTitle>
          <div className="overflow-hidden">
            {renderGraphComponent(graph, graphData)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
