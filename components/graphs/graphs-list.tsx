'use client';

import { GraphCard } from './graph-card';

interface GraphsListProps {
  graphs: any[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

export function GraphsList({ graphs, onDelete, onShare, onDownload, onView }: GraphsListProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {graphs.map((graph) => (
          <GraphCard
            key={graph._id}
            graph={{
              id: graph._id,
              title: graph.title,
              description: graph.description || '',
              type: graph.type,
              createdAt: new Date(graph.createdAt).toLocaleDateString(),
              equation: graph.equation || '',
              tags: graph.tags,
              thumbnail: '/api/placeholder/300/200',
              data: graph.data,
              config: graph.config,
              metadata: graph.metadata,
            }}
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
