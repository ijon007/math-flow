'use client';

import { ExternalLinkIcon } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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

export function BarChartComponent({
  data,
  config,
  metadata,
  onViewDetails,
}: BarChartProps) {
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
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                {config?.grid !== false && (
                  <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
                )}
                <XAxis
                  angle={-45}
                  dataKey="label"
                  height={60}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
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
                        'Value',
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
          <p className="mt-2 text-center text-muted-foreground text-xs">
            {config.xLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
