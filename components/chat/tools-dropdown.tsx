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

interface ToolsDropdownProps {
  activeTabs: Set<string>;
  toggleTab: (tab: 'steps' | 'graph' | 'test' | 'guide') => void;
  clockRef: React.RefObject<ClockIconHandle | null>;
  chartRef: React.RefObject<ChartSplineIconHandle | null>;
  flaskRef: React.RefObject<FlaskIconHandle | null>;
  bookRef: React.RefObject<BookTextIconHandle | null>;
  disabled?: boolean;
}

const tools = [
  {
    id: 'steps' as const,
    label: 'Steps',
    icon: ClockIcon,
    ref: 'clockRef' as const,
  },
  {
    id: 'graph' as const,
    label: 'Graph',
    icon: ChartSplineIcon,
    ref: 'chartRef' as const,
  },
  {
    id: 'test' as const,
    label: 'Test',
    icon: FlaskIcon,
    ref: 'flaskRef' as const,
  },
  {
    id: 'guide' as const,
    label: 'Guide',
    icon: BookTextIcon,
    ref: 'bookRef' as const,
  },
];

export function ToolsDropdown({
  activeTabs,
  toggleTab,
  clockRef,
  chartRef,
  flaskRef,
  bookRef,
  disabled = false,
}: ToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const refs = {
    clockRef,
    chartRef,
    flaskRef,
    bookRef,
  };

  const handleToolSelect = (toolId: 'steps' | 'graph' | 'test' | 'guide') => {
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

            return (
              <DropdownMenuItem
                key={tool.id}
                className={cn(
                  'flex items-center gap-2 group',
                  isActive && 'text-[#00C48D] hover:text-[#00C48D]'
                )}
                onSelect={() => handleToolSelect(tool.id)}
                onMouseEnter={() => handleMouseEnter(tool.ref)}
                onMouseLeave={() => handleMouseLeave(tool.ref)}
              >
                <IconComponent className="h-4 w-4" ref={ref} />
                <span className='group-hover:text-[#00C48D]'>{tool.label}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-[#00C48D]" />
                )}
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

              return (
                <Button
                  key={tool.id}
                  onClick={() => toggleTab(tool.id)}
                  onMouseEnter={() => handleMouseEnter(tool.ref)}
                  onMouseLeave={() => handleMouseLeave(tool.ref)}
                  className='flex items-center justify-center gap-1 bg-[#00C48D]/5 hover:bg-[#00C48D]/10 text-[#00C48D] border-[#00C48D]'
                >
                  <IconComponent ref={ref} />
                  <span>{tool.label}</span>
                </Button>
              );
            })}
        </div>
      )}
    </div>
  );
}
