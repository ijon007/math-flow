'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChartSplineIcon,
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { FlaskIcon, type FlaskIconHandle } from '../ui/flask';
import { BookTextIcon, type BookTextIconHandle } from '@/components/ui/book-text';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import { Badge } from '../ui/badge';
import { LayersIcon, type LayersIconHandle } from '../ui/layers';
import type { TabType } from '@/hooks/use-tab-management';

interface ToolsDropdownProps {
  activeTabs: Set<TabType>;
  toggleTab: (tab: 'steps' | 'graph' | 'test' | 'guide' | 'flashcards') => void;
  clockRef: React.RefObject<ClockIconHandle | null>;
  chartRef: React.RefObject<ChartSplineIconHandle | null>;
  flaskRef: React.RefObject<FlaskIconHandle | null>;
  bookRef: React.RefObject<BookTextIconHandle | null>;
  flashcardsRef: React.RefObject<LayersIconHandle | null>;
  disabled?: boolean;
}

const tools = [
  {
    id: 'steps' as const,
    label: 'Steps',
    icon: ClockIcon,
    ref: 'clockRef' as const,
    feature: 'stepByStep' as const,
  },
  {
    id: 'graph' as const,
    label: 'Graph',
    icon: ChartSplineIcon,
    ref: 'chartRef' as const,
    feature: 'graphs' as const,
  },
  {
    id: 'flashcards' as const,
    label: 'Flashcards',
    icon: LayersIcon,
    ref: 'flashcardsRef' as const,
    feature: 'flashcards' as const,
  },
  {
    id: 'test' as const,
    label: 'Test',
    icon: FlaskIcon,
    ref: 'flaskRef' as const,
    feature: 'practiceTests' as const,
  },
  {
    id: 'guide' as const,
    label: 'Guide',
    icon: BookTextIcon,
    ref: 'bookRef' as const,
    feature: 'studyGuides' as const,
  },
];

export function ToolsDropdown({
  activeTabs,
  toggleTab,
  clockRef,
  chartRef,
  flaskRef,
  bookRef,
  flashcardsRef,
  disabled = false,
}: ToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { usageLimits, hasReachedLimit, isPro } = useUsageLimits();

  const refs = {
    clockRef,
    chartRef,
    flaskRef,
    bookRef,
    flashcardsRef,
  };

  const handleToolSelect = (toolId: 'steps' | 'graph' | 'test' | 'guide' | 'flashcards') => {
    const tool = tools.find(t => t.id === toolId);
    if (tool && hasReachedLimit(tool.feature)) {
      return; // Don't allow selection if limit reached
    }
    toggleTab(toolId);
    setIsOpen(false);
  };

  const handleMouseEnter = (refName: keyof typeof refs) => {
    const ref = refs[refName];
    if (ref?.current) {
      ref.current.startAnimation();
    }
  };

  const handleMouseLeave = (refName: keyof typeof refs) => {
    const ref = refs[refName];
    if (ref?.current) {
      ref.current.stopAnimation();
    }
  };

  const hasActiveTools = activeTabs.size > 0;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button disabled={disabled} variant='outline' >
            <span>Tools</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-48">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = activeTabs.has(tool.id);
            const ref = refs[tool.ref];
            const isLimitReached = hasReachedLimit(tool.feature);
            const isBlocked = !isPro && tool.feature === 'practiceTests' || tool.feature === 'studyGuides';
            const usage = usageLimits?.[tool.feature];

            return (
              <DropdownMenuItem
                key={tool.id}
                className={cn(
                  'flex items-center gap-2 transition-all duration-300',
                  (isLimitReached || isBlocked) && 'opacity-50 cursor-not-allowed'
                )}
                onSelect={() => handleToolSelect(tool.id)}
                onMouseEnter={() => !isLimitReached && !isBlocked && handleMouseEnter(tool.ref)}
                onMouseLeave={() => !isLimitReached && !isBlocked && handleMouseLeave(tool.ref)}
                disabled={isLimitReached || isBlocked}
              >
                <IconComponent className="h-4 w-4" ref={ref} />
                <span>{tool.label}</span>
                <div className="ml-auto flex items-center gap-1">
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-[#00C48D]" />
                  )}
                  {isBlocked && (
                    <Badge className="text-xs bg-[#00C48D] text-white py-0">
                      Pro
                    </Badge>
                  )}
                  {isLimitReached && !isBlocked && (
                    <Badge variant="destructive" className="text-xs">
                      Limit Reached
                    </Badge>
                  )}
                  {!isPro && !isBlocked && !isLimitReached && usage && (
                    <span className="text-xs text-neutral-500">
                      {usage.current}/{usage.limit}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveTools && (
        <div className="flex items-center gap-1">
          {tools
            .filter((tool) => activeTabs.has(tool.id))
            .map((tool) => {
              const IconComponent = tool.icon;
              const ref = refs[tool.ref];
              const isLimitReached = hasReachedLimit(tool.feature);
              const isBlocked = !isPro && (tool.feature === 'practiceTests' || tool.feature === 'studyGuides');

              return (
                <Button
                  key={tool.id}
                  onClick={() => toggleTab(tool.id)}
                  onMouseEnter={() => !isLimitReached && !isBlocked && handleMouseEnter(tool.ref)}
                  onMouseLeave={() => !isLimitReached && !isBlocked && handleMouseLeave(tool.ref)}
                  className={cn(
                    'flex items-center justify-center gap-1 bg-[#00C48D]/5 hover:bg-[#00C48D]/10 text-[#00C48D] border-[#00C48D]',
                    (isLimitReached || isBlocked) && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={isLimitReached || isBlocked}
                >
                  <IconComponent ref={ref} />
                  <span>{tool.label}</span>
                  {(isLimitReached || isBlocked) && (
                    <Badge variant="destructive" className="text-xs ml-1">
                      {isBlocked ? 'Pro Only' : 'Limit Reached'}
                    </Badge>
                  )}
                </Button>
              );
            })}
        </div>
      )}
    </div>
  );
}
