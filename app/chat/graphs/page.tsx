'use client';

import { useState, useEffect } from 'react';
import { ChartSpline } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { GraphsList } from '@/components/graphs/graphs-list';

export default function GraphsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  
  // Get graphs for the user
  const graphs = useQuery(api.graphs.getGraphsByUser, 
    user?.id ? { userId: user.id } : "skip"
  );
  
  const deleteGraph = useMutation(api.graphs.deleteGraph);

  // Simple search filter
  const filteredGraphs = graphs?.filter(graph =>
    !searchQuery || 
    graph.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    graph.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    graph.equation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    graph.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleDelete = async (graphId: string) => {
    await deleteGraph({ graphId: graphId as any });
  };

  return (
    <div className="bg-white flex flex-col h-full rounded-xl">
      <PageHeader 
        title="Graphs" 
        icon={ChartSpline} 
        count={filteredGraphs.length} 
        countLabel="graphs" 
      />

      <PageSearch 
        placeholder="Search graphs..." 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />

      <div className="flex-1 overflow-y-auto p-4">
        {filteredGraphs.length === 0 ? (
          <PageEmptyState
            icon={ChartSpline}
            title={searchQuery ? 'No graphs found' : 'No graphs yet'}
            description="Generate mathematical graphs and visualizations to see them here."
            hasSearch={!!searchQuery}
          />
        ) : (
          <GraphsList
            graphs={filteredGraphs as any}
            onDelete={handleDelete}
            onShare={() => {}}
            onDownload={() => {}}
            onView={() => {}}
          />
        )}
      </div>
    </div>
  );
}
