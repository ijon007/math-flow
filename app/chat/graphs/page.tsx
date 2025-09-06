'use client';

import { useState } from 'react';
import { ChartSpline } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { GraphsList } from '@/components/graphs/graphs-list';
import type { Graph } from '@/constants/graphs';

export default function GraphsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const graphs = useQuery(api.graphs.getGraphsByUser, 
    user?.id ? { userId: user.id } : "skip"
  );
  const deleteGraph = useMutation(api.graphs.deleteGraph);

  // Convert to existing Graph format
  const formattedGraphs: Graph[] = graphs?.map(graph => ({
    id: graph._id,
    title: graph.title,
    description: graph.description || '',
    type: graph.type,
    createdAt: new Date(graph.createdAt).toLocaleDateString(),
    equation: graph.equation || '',
    tags: graph.tags,
    thumbnail: '/api/placeholder/300/200',
  })) || [];

  const [filteredGraphs, setFilteredGraphs] = useState<Graph[]>(formattedGraphs);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGraphs(formattedGraphs);
    } else {
      const filtered = formattedGraphs.filter(graph =>
        graph.title.toLowerCase().includes(query.toLowerCase()) ||
        graph.description.toLowerCase().includes(query.toLowerCase()) ||
        graph.equation.toLowerCase().includes(query.toLowerCase()) ||
        graph.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredGraphs(filtered);
    }
  };

  const handleDelete = async (graphId: string) => {
    await deleteGraph({ graphId: graphId as any });
    setFilteredGraphs(prev => prev.filter(graph => graph.id !== graphId));
  };

  const handleShare = (graphId: string) => {
    // Implement share functionality
    console.log('Sharing graph:', graphId);
  };

  const handleDownload = (graphId: string) => {
    // Implement download functionality
    console.log('Downloading graph:', graphId);
  };

  const handleView = (graphId: string) => {
    // Implement view functionality
    console.log('Viewing graph:', graphId);
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
        onChange={handleSearch} 
      />

      {/* Content */}
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
            graphs={filteredGraphs}
            onDelete={handleDelete}
            onShare={handleShare}
            onDownload={handleDownload}
            onView={handleView}
          />
        )}
      </div>
    </div>
  );
}
