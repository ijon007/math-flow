'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
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
  value: {
    label: 'Value',
  },
  label: {
    label: 'Category',
  },
};

export function BarChartComponent({ data, config, metadata, onViewDetails }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Bar Chart</CardTitle>
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
              {config?.title || 'Bar Chart'}
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
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                {config?.grid !== false && (
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                )}
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        Number(value).toLocaleString(),
                        'Value'
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="value"
                  fill={config?.colors?.[0] || 'hsl(var(--primary))'}
                  radius={[4, 4, 0, 0]}
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
