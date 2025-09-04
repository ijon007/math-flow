'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { useState } from 'react';

interface FunctionGraphProps {
  data: Array<{ x: number; y: number }>;
  config?: {
    title?: string;
    xLabel?: string;
    yLabel?: string;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
    grid?: boolean;
    legend?: boolean;
    colors?: string[];
  };
  metadata?: {
    expression: string;
    variable: string;
    domain: { min: number; max: number; step: number };
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

export function FunctionGraph({ data, config, metadata, onViewDetails }: FunctionGraphProps) {
  const [isHovered, setIsHovered] = useState(false);

  console.log('FunctionGraph received data:', data);
  console.log('Data length:', data?.length);
  console.log('First few data points:', data?.slice(0, 5));

  // Sort data by x values to ensure proper line rendering
  const sortedData = data ? [...data].sort((a, b) => a.x - b.x) : [];
  console.log('Sorted data first few points:', sortedData.slice(0, 5));

  if (!sortedData || sortedData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Function Graph</CardTitle>
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
              {config?.title || 'Function Graph'}
            </CardTitle>
            {metadata && (
              <CardDescription className="text-xs font-mono">
                f({metadata.variable}) = {metadata.expression}
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
        <div 
          className="h-64 w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                {config?.grid !== false && (
                  <CartesianGrid strokeDasharray="2 2" className="opacity-30" />
                )}
                <XAxis 
                  dataKey="x" 
                  type="number"
                  scale="linear"
                  domain={config?.xMin !== undefined && config?.xMax !== undefined 
                    ? [config.xMin, config.xMax] 
                    : ['dataMin', 'dataMax']
                  }
                  tickFormatter={(value) => Number.isInteger(value) ? value.toString() : value.toFixed(1)}
                  ticks={(() => {
                    const domain = config?.xMin !== undefined && config?.xMax !== undefined 
                      ? [config.xMin, config.xMax] 
                      : [Math.min(...sortedData.map(d => d.x)), Math.max(...sortedData.map(d => d.x))];
                    const min = Math.floor(domain[0]);
                    const max = Math.ceil(domain[1]);
                    const range = max - min;
                    const step = Math.max(1, Math.ceil(range / 10)); // Aim for ~10 ticks
                    const ticks = [];
                    for (let i = min; i <= max; i += step) {
                      ticks.push(i);
                    }
                    return ticks;
                  })()}
                />
                <YAxis 
                  type="number"
                  scale="linear"
                  domain={config?.yMin !== undefined && config?.yMax !== undefined 
                    ? [config.yMin, config.yMax] 
                    : ['dataMin', 'dataMax']
                  }
                  tickFormatter={(value) => Number.isInteger(value) ? value.toString() : value.toFixed(1)}
                  ticks={(() => {
                    const domain = config?.yMin !== undefined && config?.yMax !== undefined 
                      ? [config.yMin, config.yMax] 
                      : [Math.min(...sortedData.map(d => d.y)), Math.max(...sortedData.map(d => d.y))];
                    const min = Math.floor(domain[0]);
                    const max = Math.ceil(domain[1]);
                    const range = max - min;
                    const step = Math.max(1, Math.ceil(range / 10)); // Aim for ~10 ticks like X-axis
                    const ticks = [];
                    for (let i = min; i <= max; i += step) {
                      ticks.push(i);
                    }
                    return ticks;
                  })()}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `(${props.payload?.x?.toFixed(2)}, ${props.payload?.y?.toFixed(2)})`,
                        'Point'
                      ]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  name="f(x)"
                  stroke={config?.colors?.[0] || '#3b82f6'}
                  strokeWidth={0.5}
                  dot={{ r: 2, fill: '#3b82f6' }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                  connectNulls={false}
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
