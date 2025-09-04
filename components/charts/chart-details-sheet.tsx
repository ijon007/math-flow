'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface ChartDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: any;
  chartType: string;
}

export function ChartDetailsSheet({ isOpen, onClose, chartData, chartType }: ChartDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState('overview');

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
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="px-4 overflow-y-auto scrollbar-hide">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Chart Details
          </DrawerTitle>
          <DrawerDescription>
            View and export detailed information about your chart
          </DrawerDescription>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Chart Display */}
          <div className="mb-6">
            {renderChart()}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Chart Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="secondary">{chartType}</Badge>
                </div>
                {chartData?.metadata && (
                  <>
                    {chartData.metadata.dataPoints && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Data Points:</span>
                        <span className="text-sm font-medium">{chartData.metadata.dataPoints}</span>
                      </div>
                    )}
                    {chartData.metadata.expression && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Expression:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {chartData.metadata.expression}
                        </code>
                      </div>
                    )}
                    {chartData.metadata.bins && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bins:</span>
                        <span className="text-sm font-medium">{chartData.metadata.bins}</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleExport} className="w-full justify-start" variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button onClick={handleCopyData} className="w-full justify-start" variant="outline">
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className='gap-0'>
              <CardHeader className="px-2 py-0">
                <CardTitle className="text-sm">Raw Data</CardTitle>
                <CardDescription>
                  First 10 data points (total: {chartData?.data?.length || 0})
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  <pre className="text-xs bg-muted rounded-md">
                    {JSON.stringify(chartData?.data?.slice(0, 10), null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Chart Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chartData?.config && Object.keys(chartData.config).length > 0 ? (
                    Object.entries(chartData.config).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-sm font-medium">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No custom configuration</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
