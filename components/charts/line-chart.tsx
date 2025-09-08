'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
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

export function LineChartComponent({
  data,
  config,
  metadata,
  onViewDetails,
}: LineChartProps) {
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
            <LineChart data={data} height={256} width={274}>
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
                    formatter={(value, name) => [
                      `(${data[Number(value)]?.x?.toFixed(2)}, ${data[Number(value)]?.y?.toFixed(2)})`,
                      'Point',
                    ]}
                  />
                }
              />
              <Line
                activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                dataKey="y"
                dot={{ r: 3 }}
                stroke={config?.colors?.[0] || 'hsl(var(--primary))'}
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
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
