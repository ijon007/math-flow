'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
  count: number;
  countLabel: string;
}

export function PageHeader({ title, icon: Icon, count, countLabel }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white rounded-t-xl border-b">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#00C48D]" />
          <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
        </div>
      </div>
      <Badge variant="secondary" className="bg-[#00C48D]/10 text-[#00C48D] border-[#00C48D]/20">
        {count} {countLabel}
      </Badge>
    </div>
  );
}
