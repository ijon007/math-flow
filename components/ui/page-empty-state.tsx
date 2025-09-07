'use client';

import type { LucideIcon } from 'lucide-react';

interface PageEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  hasSearch: boolean;
}

export function PageEmptyState({
  icon: Icon,
  title,
  description,
  hasSearch,
}: PageEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Icon className="mb-4 h-12 w-12 text-neutral-300" />
      <h3 className="mb-2 font-medium text-lg text-neutral-900">{title}</h3>
      <p className="max-w-sm text-neutral-500 text-sm">
        {hasSearch
          ? 'Try adjusting your search terms or clear the search to see all items.'
          : description}
      </p>
    </div>
  );
}
