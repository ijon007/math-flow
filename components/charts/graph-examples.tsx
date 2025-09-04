'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FunctionGraph, BarChartComponent, LineChartComponent, ScatterPlotComponent } from './index';

// Example data for demonstration
const functionData = Array.from({ length: 100 }, (_, i) => {
  const x = (i - 50) * 0.2;
  return { x, y: Math.sin(x) * Math.exp(-x * 0.1) };
});

const barData = [
  { label: 'A', value: 20 },
  { label: 'B', value: 35 },
  { label: 'C', value: 15 },
  { label: 'D', value: 40 },
  { label: 'E', value: 25 },
];

const lineData = Array.from({ length: 20 }, (_, i) => ({
  x: i,
  y: Math.random() * 100 + i * 2
}));

const scatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  label: `Point ${Math.floor(Math.random() * 10)}`
}));

export function GraphExamples() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Graph Generation Examples</h2>
        <p className="text-muted-foreground">
          Examples of different chart types available in the math-flow app
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Function Graph</CardTitle>
            <CardDescription>
              Mathematical function: f(x) = sin(x) * e^(-0.1x)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FunctionGraph
              data={functionData}
              config={{
                title: 'Damped Sine Wave',
                xLabel: 'x',
                yLabel: 'f(x)'
              }}
              metadata={{
                expression: 'sin(x) * exp(-0.1*x)',
                variable: 'x',
                domain: { min: -10, max: 10, step: 0.2 }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>
              Sample categorical data visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={barData}
              config={{
                title: 'Sample Data',
                xLabel: 'Categories',
                yLabel: 'Values'
              }}
              metadata={{
                dataPoints: barData.length
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>
              Time series data with trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartComponent
              data={lineData}
              config={{
                title: 'Trend Analysis',
                xLabel: 'Time',
                yLabel: 'Value'
              }}
              metadata={{
                dataPoints: lineData.length
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scatter Plot</CardTitle>
            <CardDescription>
              Correlation analysis between two variables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScatterPlotComponent
              data={scatterData}
              config={{
                title: 'Correlation Analysis',
                xLabel: 'Variable X',
                yLabel: 'Variable Y'
              }}
              metadata={{
                dataPoints: scatterData.length
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            Try these example prompts in the chat:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-md">
              <code className="text-sm">
                "Create a function graph for y = x^2 + 2x + 1"
              </code>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-sm">
                "Plot a sine wave from -π to π"
              </code>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-sm">
                "Create a bar chart for sales data: A=100, B=150, C=200"
              </code>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-sm">
                "Make a scatter plot for these points: (1,2), (2,4), (3,6)"
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
