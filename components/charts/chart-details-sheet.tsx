'use client';

import { CopyIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import {
  BarChartComponent,
  FunctionGraph,
  HistogramComponent,
  LineChartComponent,
  ScatterPlotComponent,
} from '@/components/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { MathExpression } from '@/components/ui/math-expression';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  const handleExport = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartType}-data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyData = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    navigator.clipboard.writeText(dataStr);
  };

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
              View and export detailed information about your chart
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Chart Display */}
            <div className="mb-6">
              <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                {renderChart()}
              </div>
            </div>

            <Tabs onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent className="space-y-3" value="overview">
                <div className="mb-2 font-medium text-sm">
                  Chart Information
                </div>
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

                <div className="mt-4 mb-2 font-medium text-sm">Actions</div>
                <div className="space-y-2">
                  <Button
                    className="h-9 w-full justify-start text-sm"
                    onClick={handleExport}
                    variant="outline"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button
                    className="h-9 w-full justify-start text-sm"
                    onClick={handleCopyData}
                    variant="outline"
                  >
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy Data
                  </Button>
                </div>
              </TabsContent>

              <TabsContent className="space-y-3" value="data">
                <div className="mb-2 font-medium text-sm">Raw Data</div>
                <div className="mb-3 text-muted-foreground text-sm">
                  First 10 data points (total: {chartData?.data?.length || 0})
                </div>
                <div className="scrollbar-thin max-h-64 overflow-y-auto">
                  <pre className="rounded bg-muted p-3 text-sm">
                    {JSON.stringify(chartData?.data?.slice(0, 10), null, 2)}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent className="space-y-3" value="settings">
                <div className="mb-2 font-medium text-sm">
                  Chart Configuration
                </div>
                <div className="space-y-2 text-sm">
                  {chartData?.config &&
                  Object.keys(chartData.config).length > 0 ? (
                    Object.entries(chartData.config).map(([key, value]) => (
                      <div className="flex justify-between" key={key}>
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span>
                          {typeof value === 'boolean'
                            ? value
                              ? 'Yes'
                              : 'No'
                            : String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No custom configuration
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
