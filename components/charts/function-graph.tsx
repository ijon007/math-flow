'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { MathExpression } from '@/components/ui/math-expression';

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
  fullView?: boolean;
}

const chartConfig = {
  x: {
    label: 'X',
  },
  y: {
    label: 'Y',
  },
};

export function FunctionGraph({
  data,
  config,
  metadata,
  onViewDetails,
  fullView = false,
}: FunctionGraphProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Sort data by x values to ensure proper line rendering
  const sortedData = data ? [...data].sort((a, b) => a.x - b.x) : [];

  if (!sortedData || sortedData.length === 0) {
    if (fullView) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 font-semibold text-lg">Function Graph</h3>
            <p className="text-muted-foreground">No data available</p>
          </div>
        </div>
      );
    }
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Function Graph</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (fullView) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="mb-4">
          <h3 className="mb-1 font-semibold text-lg">
            {config?.title || 'Function Graph'}
          </h3>
          {metadata && (
            <p className="text-muted-foreground text-sm">
              f({metadata.variable}) ={' '}
              <MathExpression expression={metadata.expression} inline={true} />
            </p>
          )}
        </div>
        <div
          className="w-full flex-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={sortedData}>
                {config?.grid !== false && (
                  <CartesianGrid className="opacity-30" strokeDasharray="2 2" />
                )}
                <XAxis
                  dataKey="x"
                  domain={
                    config?.xMin !== undefined && config?.xMax !== undefined
                      ? [config.xMin, config.xMax]
                      : ['dataMin', 'dataMax']
                  }
                  scale="linear"
                  tickFormatter={(value) =>
                    Number.isInteger(value)
                      ? value.toString()
                      : value.toFixed(1)
                  }
                  ticks={(() => {
                    const domain =
                      config?.xMin !== undefined && config?.xMax !== undefined
                        ? [config.xMin, config.xMax]
                        : [
                            Math.min(...sortedData.map((d) => d.x)),
                            Math.max(...sortedData.map((d) => d.x)),
                          ];
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
                  type="number"
                />
                <YAxis
                  domain={
                    config?.yMin !== undefined && config?.yMax !== undefined
                      ? [config.yMin, config.yMax]
                      : ['dataMin', 'dataMax']
                  }
                  scale="linear"
                  tickFormatter={(value) =>
                    Number.isInteger(value)
                      ? value.toString()
                      : value.toFixed(1)
                  }
                  ticks={(() => {
                    const domain =
                      config?.yMin !== undefined && config?.yMax !== undefined
                        ? [config.yMin, config.yMax]
                        : [
                            Math.min(...sortedData.map((d) => d.y)),
                            Math.max(...sortedData.map((d) => d.y)),
                          ];
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
                  type="number"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `(${props.payload?.x?.toFixed(2)}, ${props.payload?.y?.toFixed(2)})`,
                        'Point',
                      ]}
                    />
                  }
                />
                <Line
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                  connectNulls={false}
                  dataKey="y"
                  dot={{ r: 2, fill: '#3b82f6' }}
                  name="f(x)"
                  stroke={config?.colors?.[0] || '#3b82f6'}
                  strokeWidth={0.5}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        {config?.xLabel && (
          <p className="mt-2 text-center text-muted-foreground text-xs">
            {config.xLabel}
          </p>
        )}
      </div>
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
              <CardDescription className="text-xs">
                f({metadata.variable}) ={' '}
                <MathExpression
                  expression={metadata.expression}
                  inline={true}
                />
              </CardDescription>
            )}
          </div>
          {onViewDetails && (
            <Button
              className="opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0"
              onClick={onViewDetails}
              size="sm"
              variant="ghost"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div
          className="h-64 w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={sortedData}>
                {config?.grid !== false && (
                  <CartesianGrid className="opacity-30" strokeDasharray="2 2" />
                )}
                <XAxis
                  dataKey="x"
                  domain={
                    config?.xMin !== undefined && config?.xMax !== undefined
                      ? [config.xMin, config.xMax]
                      : ['dataMin', 'dataMax']
                  }
                  scale="linear"
                  tickFormatter={(value) =>
                    Number.isInteger(value)
                      ? value.toString()
                      : value.toFixed(1)
                  }
                  ticks={(() => {
                    const domain =
                      config?.xMin !== undefined && config?.xMax !== undefined
                        ? [config.xMin, config.xMax]
                        : [
                            Math.min(...sortedData.map((d) => d.x)),
                            Math.max(...sortedData.map((d) => d.x)),
                          ];
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
                  type="number"
                />
                <YAxis
                  domain={
                    config?.yMin !== undefined && config?.yMax !== undefined
                      ? [config.yMin, config.yMax]
                      : ['dataMin', 'dataMax']
                  }
                  scale="linear"
                  tickFormatter={(value) =>
                    Number.isInteger(value)
                      ? value.toString()
                      : value.toFixed(1)
                  }
                  ticks={(() => {
                    const domain =
                      config?.yMin !== undefined && config?.yMax !== undefined
                        ? [config.yMin, config.yMax]
                        : [
                            Math.min(...sortedData.map((d) => d.y)),
                            Math.max(...sortedData.map((d) => d.y)),
                          ];
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
                  type="number"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => [
                        `(${props.payload?.x?.toFixed(2)}, ${props.payload?.y?.toFixed(2)})`,
                        'Point',
                      ]}
                    />
                  }
                />
                <Line
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                  connectNulls={false}
                  dataKey="y"
                  dot={{ r: 2, fill: '#3b82f6' }}
                  name="f(x)"
                  stroke={config?.colors?.[0] || '#3b82f6'}
                  strokeWidth={0.5}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        {config?.xLabel && (
          <p className="mt-2 text-center text-muted-foreground text-xs">
            {config.xLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
