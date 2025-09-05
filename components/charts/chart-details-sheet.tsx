'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CopyIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { 
  FunctionGraph, 
  BarChartComponent, 
  LineChartComponent, 
  ScatterPlotComponent, 
  HistogramComponent 
} from '@/components/charts';
import { useIsMobile } from '@/hooks/use-mobile';
import { MathExpression } from '@/components/ui/math-expression';

interface ChartDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: any;
  chartType: string;
}

export function ChartDetailsSheet({ isOpen, onClose, chartData, chartType }: ChartDetailsSheetProps) {
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
      onViewDetails: undefined // Don't show view details button in the sheet
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
    <Drawer open={isOpen} onOpenChange={onClose} direction={isMobile ? 'bottom' : 'right'}>
      <DrawerContent className="px-0 overflow-hidden">
        <div className="flex flex-col h-full">
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
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
                {renderChart()}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3">
                <div className="text-sm font-medium mb-2">Chart Information</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary" className="text-sm px-2 py-1">{chartType}</Badge>
                  </div>
                  {chartData?.metadata && (
                    <>
                      {chartData.metadata.dataPoints && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Points:</span>
                          <span>{chartData.metadata.dataPoints}</span>
                        </div>
                      )}
                      {chartData.metadata.expression && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Expression:</span>
                          <div className="text-sm bg-muted px-2 py-1 rounded">
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

                <div className="text-sm font-medium mb-2 mt-4">Actions</div>
                <div className="space-y-2">
                  <Button onClick={handleExport} className="w-full justify-start h-9 text-sm" variant="outline">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={handleCopyData} className="w-full justify-start h-9 text-sm" variant="outline">
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy Data
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-3">
                <div className="text-sm font-medium mb-2">Raw Data</div>
                <div className="text-sm text-muted-foreground mb-3">
                  First 10 data points (total: {chartData?.data?.length || 0})
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  <pre className="text-sm bg-muted rounded p-3">
                    {JSON.stringify(chartData?.data?.slice(0, 10), null, 2)}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-3">
                <div className="text-sm font-medium mb-2">Chart Configuration</div>
                <div className="space-y-2 text-sm">
                  {chartData?.config && Object.keys(chartData.config).length > 0 ? (
                    Object.entries(chartData.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span>
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No custom configuration</p>
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
