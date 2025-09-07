'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { ChartSpline } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GraphsList } from '@/components/graphs/graphs-list';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { api } from '@/convex/_generated/api';

export default function GraphsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  // Get graphs for the user
  const graphs = useQuery(
    api.graphs.getGraphsByUser,
    user?.id ? { userId: user.id } : 'skip'
  );

  const deleteGraph = useMutation(api.graphs.deleteGraph);

  // Simple search filter
  const filteredGraphs =
    graphs?.filter(
      (graph) =>
        !searchQuery ||
        graph.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        graph.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        graph.equation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        graph.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  const handleDelete = async (graphId: string) => {
    await deleteGraph({ graphId: graphId as any });
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <PageHeader
        count={filteredGraphs.length}
        countLabel="graphs"
        icon={ChartSpline}
        title="Graphs"
      />

      <PageSearch
        onChange={setSearchQuery}
        placeholder="Search graphs..."
        value={searchQuery}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {filteredGraphs.length === 0 ? (
          <PageEmptyState
            description="Generate mathematical graphs and visualizations to see them here."
            hasSearch={!!searchQuery}
            icon={ChartSpline}
            title={searchQuery ? 'No graphs found' : 'No graphs yet'}
          />
        ) : (
          <GraphsList
            graphs={filteredGraphs as any}
            onDelete={handleDelete}
            onDownload={() => {}}
            onShare={() => {}}
            onView={() => {}}
          />
        )}
      </div>
    </div>
  );
}
