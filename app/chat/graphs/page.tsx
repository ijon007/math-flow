'use client';

import { useState } from 'react';
import { ChartSpline } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { GraphsList } from '@/components/graphs/graphs-list';
import { generatedGraphs } from '@/constants/graphs';
import type { Graph } from '@/constants/graphs';

export default function GraphsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGraphs, setFilteredGraphs] = useState<Graph[]>(generatedGraphs);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGraphs(generatedGraphs);
    } else {
      const filtered = generatedGraphs.filter(graph =>
        graph.title.toLowerCase().includes(query.toLowerCase()) ||
        graph.description.toLowerCase().includes(query.toLowerCase()) ||
        graph.equation.toLowerCase().includes(query.toLowerCase()) ||
        graph.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredGraphs(filtered);
    }
  };

  const handleDelete = (graphId: string) => {
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
