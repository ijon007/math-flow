'use client';

import {
  Calendar,
  ChartSpline,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Share,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { FunctionGraph } from '@/components/charts/function-graph';
import { HistogramComponent } from '@/components/charts/histogram';
import { LineChartComponent } from '@/components/charts/line-chart';
import { ScatterPlotComponent } from '@/components/charts/scatter-plot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MathExpression } from '@/components/ui/math-expression';
import { ShareButton } from '@/components/ui/share-button';
import type { Graph } from '@/constants/graphs';

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
    ...graph.config,
  };

  const commonMetadata = {
    ...graph.metadata,
  };

  switch (graph.type) {
    case 'function':
      return (
        <FunctionGraph
          config={commonConfig}
          data={graphData}
          fullView={true}
          metadata={{
            expression: graph.equation,
            variable: 'x',
            domain: { min: -10, max: 10, step: 0.1 },
            ...commonMetadata,
          }}
        />
      );
    case 'bar':
      return (
        <BarChartComponent
          config={commonConfig}
          data={graphData}
          metadata={commonMetadata}
        />
      );
    case 'line':
      return (
        <LineChartComponent
          config={commonConfig}
          data={graphData}
          metadata={commonMetadata}
        />
      );
    case 'scatter':
      return (
        <ScatterPlotComponent
          config={commonConfig}
          data={graphData}
          metadata={commonMetadata}
        />
      );
    case 'histogram':
      return (
        <HistogramComponent
          config={commonConfig}
          data={graphData}
          metadata={commonMetadata}
        />
      );
    case 'polar':
    case 'parametric':
      // For now, use FunctionGraph as fallback for polar and parametric
      return (
        <FunctionGraph
          config={commonConfig}
          data={graphData}
          fullView={true}
          metadata={{
            expression: graph.equation,
            variable: 'x',
            domain: { min: -10, max: 10, step: 0.1 },
            ...commonMetadata,
          }}
        />
      );
    default:
      return (
        <FunctionGraph
          config={commonConfig}
          data={graphData}
          fullView={true}
          metadata={{
            expression: graph.equation,
            variable: 'x',
            domain: { min: -10, max: 10, step: 0.1 },
            ...commonMetadata,
          }}
        />
      );
  }
}

export function GraphCard({
  graph,
  onDelete,
  onShare,
  onDownload,
  onView,
}: GraphCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const graphData = getGraphData(graph);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div
        className="group cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50"
        onClick={handleCardClick}
      >
        <div className="mb-2 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate font-medium text-base text-neutral-900">
              {graph.title}
            </h3>
            <div className="flex items-center gap-2 text-neutral-500 text-xs">
              <Calendar className="h-3 w-3" />
              <span>{graph.createdAt}</span>
              <Badge
                className="border-[#00C48D]/20 bg-[#00C48D]/10 text-[#00C48D] text-xs"
                variant="outline"
              >
                {graph.type}
              </Badge>
            </div>
          </div>
          <ShareButton
            itemType="graph"
            itemId={graph.id}
            className="group-hover:opacity-100 lg:opacity-0"
          />
          <Button
            className="size-7 transition-colors duration-200 hover:bg-red-500/20 hover:text-red-500 group-hover:opacity-100 lg:opacity-0"
            onClick={() => onDelete(graph.id)}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md bg-neutral-200/60 p-3">
          <div className="text-neutral-700 text-sm">
            <MathExpression expression={graph.equation} inline={false} />
          </div>
        </div>
      </div>

      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogContent className="max-w-4xl overflow-hidden px-3">
          <DialogTitle className="sr-only font-semibold text-lg">
            {graph.title}
          </DialogTitle>
          <div className="overflow-hidden">
            {renderGraphComponent(graph, graphData)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
