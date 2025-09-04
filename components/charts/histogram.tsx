'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

interface HistogramProps {
  data: Array<{ x: number; y: number; label: string }>;
  config?: {
    title?: string;
    xLabel?: string;
    yLabel?: string;
    grid?: boolean;
    legend?: boolean;
    colors?: string[];
  };
  metadata?: {
    bins: number;
    binWidth: number;
    dataPoints: number;
  };
  onViewDetails?: () => void;
}

const chartConfig = {
  y: {
    label: 'Frequency',
  },
  x: {
    label: 'Value',
  },
};

export function HistogramComponent({ data, config, metadata, onViewDetails }: HistogramProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Histogram</CardTitle>
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
              {config?.title || 'Histogram'}
            </CardTitle>
            {metadata && (
              <CardDescription className="text-xs">
                {metadata.bins} bins, {metadata.dataPoints} data points
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
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `${Number(value).toLocaleString()} occurrences`,
                        props.payload?.label || 'Bin'
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="y"
                  fill={config?.colors?.[0] || 'hsl(var(--primary))'}
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
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
