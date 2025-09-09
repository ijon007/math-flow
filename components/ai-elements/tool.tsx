'use client';

import type { ToolUIPart } from 'ai';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import {
  BarChartComponent,
  ChartDetailsSheet,
  FunctionGraph,
  HistogramComponent,
  LineChartComponent,
  ScatterPlotComponent,
} from '@/components/charts';
import { FlashcardComponent } from '@/components/flashcards';
import { PracticeTestComponent } from '@/components/practice-tests/practice-test';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code-block';
import { StepByStepContainer } from './step-by-step';

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn('not-prose w-full rounded-md', className)}
    {...props}
  />
);

export type ToolHeaderProps = {
  type: ToolUIPart['type'];
  state: ToolUIPart['state'];
  className?: string;
};

const getStatusBadge = (status: ToolUIPart['state']) => {
  const labels = {
    'input-streaming': 'Pending',
    'input-available': 'Running',
    'output-available': 'Completed',
    'output-error': 'Error',
  } as const;

  const icons = {
    'input-streaming': <CircleIcon className="size-4" />,
    'input-available': <ClockIcon className="size-4 animate-pulse" />,
    'output-available': <CheckCircleIcon className="size-4 text-green-600" />,
    'output-error': <XCircleIcon className="size-4 text-red-600" />,
  } as const;

  return (
    <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const ToolHeader = ({
  className,
  type,
  state,
  ...props
}: ToolHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      'flex w-full items-center justify-between gap-4 p-3',
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      <WrenchIcon className="size-4 text-muted-foreground" />
      <span className="font-medium text-sm">{type}</span>
      {getStatusBadge(state)}
    </div>
    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<'div'> & {
  input: ToolUIPart['input'];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) =>
  null;

export type ToolOutputProps = ComponentProps<'div'> & {
  output: ReactNode;
  errorText: ToolUIPart['errorText'];
  toolType?: string;
  threadId?: string;
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  toolType,
  threadId,
  ...props
}: ToolOutputProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [chartData, setChartData] = useState<any>(null);

  if (!(output || errorText)) {
    return null;
  }

  // Check if output contains chart data
  const isChartOutput =
    typeof output === 'object' &&
    output !== null &&
    'type' in (output as any) &&
    'data' in (output as any);

  // Check if output contains step-by-step data
  const isStepByStepOutput =
    typeof output === 'object' &&
    output !== null &&
    'type' in (output as any) &&
    (output as any).type === 'step-by-step';

  // Check if output contains flashcard data
  const isFlashcardOutput =
    typeof output === 'object' &&
    output !== null &&
    'type' in (output as any) &&
    (output as any).type === 'flashcards';

  // Check if output contains practice test data
  const isPracticeTestOutput =
    typeof output === 'object' &&
    output !== null &&
    'type' in (output as any) &&
    (output as any).type === 'practice-test';

  const handleViewDetails = () => {
    if (isChartOutput) {
      setChartData(output);
      setShowDetails(true);
    }
  };

  const renderChart = () => {
    if (!isChartOutput) return null;

    const chartProps = {
      data: (output as any).data,
      config: (output as any).config,
      metadata: (output as any).metadata,
      onViewDetails: handleViewDetails,
    };

    switch ((output as any).type) {
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
    <div className={cn('space-y-2 p-1', className)} {...props}>
      <div
        className={cn(
          'overflow-x-auto rounded-sm text-xs [&_table]:w-full',
          errorText
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted/50 text-foreground'
        )}
      >
        {errorText && <div>{errorText}</div>}
        {output && (
          <div>
            {isChartOutput ? (
              <div className="group">{renderChart()}</div>
            ) : isStepByStepOutput ? (
              <StepByStepContainer data={output as any} />
            ) : isFlashcardOutput ? (
              <FlashcardComponent data={output as any} />
            ) : isPracticeTestOutput ? (
              <PracticeTestComponent data={output as any} threadId={threadId} />
            ) : (
              <div>
                {typeof output === 'object'
                  ? JSON.stringify(output, null, 2)
                  : String(output)}
              </div>
            )}
          </div>
        )}
      </div>

      {isChartOutput && (
        <ChartDetailsSheet
          chartData={chartData}
          chartType={(output as any).type}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};
