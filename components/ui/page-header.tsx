'use client';

import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
  count: number;
  countLabel: string;
}

export function PageHeader({
  title,
  icon: Icon,
  count,
  countLabel,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-t-xl border-b bg-white px-4 py-2">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg text-neutral-900">{title}</h1>
        </div>
      </div>
      <Badge
        className="border-[#00C48D]/20 bg-[#00C48D]/10 text-[#00C48D]"
        variant="secondary"
      >
        {count} {countLabel}
      </Badge>
    </div>
  );
}
