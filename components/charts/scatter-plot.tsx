'use client';

import { ExternalLinkIcon } from 'lucide-react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
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

export function ScatterPlotComponent({
  data,
  config,
  metadata,
  onViewDetails,
}: ScatterPlotProps) {
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
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={onViewDetails}
              size="sm"
              variant="ghost"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 w-full">
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <ScatterChart data={data} height={256} width={274}>
              {config?.grid !== false && (
                <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
              )}
              <XAxis
                dataKey="x"
                scale="linear"
                tickFormatter={(value) => value.toFixed(1)}
                type="number"
              />
              <YAxis
                scale="linear"
                tickFormatter={(value) => value.toFixed(1)}
                type="number"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => [
                      `(${props.payload?.x?.toFixed(2)}, ${props.payload?.y?.toFixed(2)})`,
                      props.payload?.label || 'Point',
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
