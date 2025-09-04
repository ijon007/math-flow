'use client';

import { GraphCard } from './graph-card';
import type { Graph } from '@/constants/graphs';

interface GraphsListProps {
  graphs: Graph[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

export function GraphsList({ graphs, onDelete, onShare, onDownload, onView }: GraphsListProps) {
  return (
    <div className="grid gap-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {graphs.map((graph) => (
          <GraphCard
            key={graph.id}
            graph={graph}
            onDelete={onDelete}
            onShare={onShare}
            onDownload={onDownload}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}
