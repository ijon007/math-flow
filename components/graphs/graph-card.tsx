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

// Function to generate sample data for different graph types
function generateGraphData(graph: Graph) {
  const data = [];
  const step = 0.1;
  
  switch (graph.id) {
    case '1': // Quadratic: f(x) = x² - 4x + 3
      for (let x = -2; x <= 6; x += step) {
        data.push({ x, y: x * x - 4 * x + 3 });
      }
      break;
    case '2': // Trigonometric: sin(x), cos(x), tan(x)
      for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += step) {
        data.push({ x, y: Math.sin(x) });
      }
      break;
    case '3': // Exponential: P(t) = P₀ × e^(rt)
      for (let x = 0; x <= 5; x += step) {
        data.push({ x, y: 100 * Math.exp(0.5 * x) });
      }
      break;
    case '4': // Cubic: f(x) = x³ - 3x² + 2x
      for (let x = -1; x <= 4; x += step) {
        data.push({ x, y: x * x * x - 3 * x * x + 2 * x });
      }
      break;
    case '5': // 3D Surface: z = sin(x)cos(y) - using x as parameter
      for (let x = -Math.PI; x <= Math.PI; x += step) {
        data.push({ x, y: Math.sin(x) * Math.cos(x) });
      }
      break;
    case '6': // Normal distribution: N(μ, σ²)
      for (let x = -3; x <= 3; x += step) {
        data.push({ x, y: Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI) });
      }
      break;
    default:
      // Default linear function
      for (let x = -5; x <= 5; x += step) {
        data.push({ x, y: x });
      }
  }
  
  return data;
}

export function GraphCard({ graph, onDelete, onShare, onDownload, onView }: GraphCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const graphData = generateGraphData(graph);

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
            <FunctionGraph
              data={graphData}
              config={{
                title: graph.title,
                xLabel: 'X',
                yLabel: 'Y',
                grid: true,
              }}
              metadata={{
                expression: graph.equation,
                variable: 'x',
                domain: { min: -10, max: 10, step: 0.1 }
              }}
              fullView={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
