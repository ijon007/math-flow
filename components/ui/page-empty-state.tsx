'use client';

import { LucideIcon } from 'lucide-react';

interface PageEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  hasSearch: boolean;
}

export function PageEmptyState({ icon: Icon, title, description, hasSearch }: PageEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Icon className="h-12 w-12 text-neutral-300 mb-4" />
      <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm max-w-sm">
        {hasSearch 
          ? 'Try adjusting your search terms or clear the search to see all items.'
          : description
        }
      </p>
    </div>
  );
}
