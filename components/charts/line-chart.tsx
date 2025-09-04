'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

interface LineChartProps {
  data: Array<{ x: number; y: number }>;
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

export function LineChartComponent({ data, config, metadata, onViewDetails }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Line Chart</CardTitle>
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
              {config?.title || 'Line Chart'}
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
              <LineChart data={data}>
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
                      formatter={(value, name) => [
                        `(${data[Number(value)]?.x?.toFixed(2)}, ${data[Number(value)]?.y?.toFixed(2)})`,
                        'Point'
                      ]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={config?.colors?.[0] || 'hsl(var(--primary))'}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
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
