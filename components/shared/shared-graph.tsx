'use client';

import { ChartSpline, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MathExpression } from '@/components/ui/math-expression';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { FunctionGraph } from '@/components/charts/function-graph';
import { HistogramComponent } from '@/components/charts/histogram';
import { LineChartComponent } from '@/components/charts/line-chart';
import { ScatterPlotComponent } from '@/components/charts/scatter-plot';

interface SharedGraphProps {
  graph: any; // Graph type from Convex
}

// Function to get graph data from the database graph object
function getGraphData(graph: any) {
  if (graph.data && Array.isArray(graph.data)) {
    return graph.data;
  }

  // Fallback: generate sample data for different graph types
  const data = [];
  const step = 0.1;

  switch (graph.type) {
    case 'function':
      for (let x = -5; x <= 5; x += step) {
        try {
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
            y = x;
          }
          data.push({ x, y });
        } catch (error) {
          data.push({ x, y: x });
        }
      }
      break;
    default:
      for (let x = -5; x <= 5; x += step) {
        data.push({ x, y: x });
      }
  }

  return data;
}

// Function to render the appropriate chart component based on graph type
function renderGraphComponent(graph: any, graphData: any[]) {
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

export function SharedGraph({ graph }: SharedGraphProps) {
  const graphData = getGraphData(graph);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              {graph.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <ChartSpline className="h-4 w-4" />
                <span>{graph.type} graph</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Shared</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              className="border-[#00C48D]/20 bg-[#00C48D]/10 text-[#00C48D] text-xs"
              variant="outline"
            >
              {graph.type}
            </Badge>
          </div>

          {graph.equation && (
            <div className="rounded-lg bg-neutral-50 p-4">
              <div className="text-sm text-neutral-700">
                <MathExpression expression={graph.equation} inline={false} />
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-white p-4">
            {renderGraphComponent(graph, graphData)}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-600">
              Interact with this graph by signing in above
            </p>
          </div>

          {graph.tags && graph.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {graph.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center">
            <p className="mb-3 text-sm text-neutral-600">
              Want to interact with this graph? Sign in to save it to your library.
            </p>
            <Button
              onClick={() => {
                // Store the shared item info in localStorage for after sign-in
                localStorage.setItem('sharedItem', JSON.stringify({
                  type: 'graph',
                  id: graph._id,
                  redirectTo: `/chat/graphs`
                }));
                // Redirect to sign in
                window.location.href = '/chat';
              }}
              className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-white border-none"
              size="sm"
            >
              Sign In to View
            </Button>
          </div>
          <p className="text-sm text-neutral-500">
            This graph was shared from Math Flow
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
