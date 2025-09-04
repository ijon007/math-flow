'use client';

import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

interface ScatterPlotProps {
  data: Array<{ x: number; y: number; label?: string }>;
  config?: {
    title?: string;
    xLabel?: string;
    yLabel?: string;
    grid?: boolean;
    legend?: boolean;
    colors?: string[];
  };
  metadata?: {
    dataPoints: number;
  };
  onViewDetails?: () => void;
}

const chartConfig = {
  x: {
    label: 'X',
  },
  y: {
    label: 'Y',
  },
};

export function ScatterPlotComponent({ data, config, metadata, onViewDetails }: ScatterPlotProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Scatter Plot</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">
              {config?.title || 'Scatter Plot'}
            </CardTitle>
            {metadata && (
              <CardDescription className="text-xs">
                {metadata.dataPoints} data points
              </CardDescription>
            )}
          </div>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data}>
                {config?.grid !== false && (
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                )}
                <XAxis 
                  dataKey="x" 
                  type="number"
                  scale="linear"
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <YAxis 
                  type="number"
                  scale="linear"
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `(${props.payload?.x?.toFixed(2)}, ${props.payload?.y?.toFixed(2)})`,
                        props.payload?.label || 'Point'
                      ]}
                    />
                  }
                />
                <Scatter
                  dataKey="y"
                  fill={config?.colors?.[0] || 'hsl(var(--primary))'}
                  r={4}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        {config?.xLabel && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            {config.xLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
