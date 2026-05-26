'use client';

import { SettingsIcon } from 'lucide-react';
import {
  BarChartComponent,
  FunctionGraph,
  HistogramComponent,
  LineChartComponent,
  ScatterPlotComponent,
} from '@/components/charts';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { MathExpression } from '@/components/ui/math-expression';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: any;
  chartType: string;
}

export function ChartDetailsSheet({
  isOpen,
  onClose,
  chartData,
  chartType,
}: ChartDetailsSheetProps) {
  const isMobile = useIsMobile();

  const renderChart = () => {
    if (!chartData) return null;

    const chartProps = {
      data: chartData.data,
      config: chartData.config,
      metadata: chartData.metadata,
      onViewDetails: undefined, // Don't show view details button in the sheet
    };

    switch (chartData.type) {
      case 'function':
        return <FunctionGraph {...chartProps} />;
      case 'bar':
        return <BarChartComponent {...chartProps} />;
      case 'line':
        return <LineChartComponent {...chartProps} />;
      case 'scatter':
        return <ScatterPlotComponent {...chartProps} />;
      case 'histogram':
        return <HistogramComponent {...chartProps} />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      onOpenChange={onClose}
      open={isOpen}
    >
      <DrawerContent className="overflow-hidden px-0">
        <div className="flex h-full flex-col">
          <DrawerHeader className="px-6 py-4">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <SettingsIcon className="h-5 w-5" />
              Chart Details
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              View detailed information about your chart
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-6">
              <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                {renderChart()}
              </div>
            </div>

            <div className="space-y-3">
              <div className="mb-2 font-medium text-sm">Chart Information</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge className="px-2 py-1 text-sm" variant="secondary">
                    {chartType}
                  </Badge>
                </div>
                {chartData?.metadata && (
                  <>
                    {chartData.metadata.dataPoints && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Data Points:
                        </span>
                        <span>{chartData.metadata.dataPoints}</span>
                      </div>
                    )}
                    {chartData.metadata.expression && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Expression:
                        </span>
                        <div className="rounded bg-muted px-2 py-1 text-sm">
                          <MathExpression
                            expression={chartData.metadata.expression}
                            inline={true}
                          />
                        </div>
                      </div>
                    )}
                    {chartData.metadata.bins && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bins:</span>
                        <span>{chartData.metadata.bins}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
