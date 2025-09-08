'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

export function HistogramComponent({
  data,
  config,
  metadata,
  onViewDetails,
}: HistogramProps) {
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
            <BarChart
              data={data}
              height={256}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              width={274}
            >
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
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => [
                      `${Number(value).toLocaleString()} occurrences`,
                      props.payload?.label || 'Bin',
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
