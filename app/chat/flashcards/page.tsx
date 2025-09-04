'use client';

import { useState } from 'react';
import { Layers } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { FlashcardGroupsList } from '@/components/flashcards/flashcard-groups-list';
import { flashcardGroups } from '@/constants/flashcards';
import type { FlashcardGroup } from '@/constants/flashcards';

export default function FlashcardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<FlashcardGroup[]>(flashcardGroups);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGroups(flashcardGroups);
    } else {
      const filtered = flashcardGroups.filter(group =>
        group.title.toLowerCase().includes(query.toLowerCase()) ||
        group.description.toLowerCase().includes(query.toLowerCase()) ||
        group.subject.toLowerCase().includes(query.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredGroups(filtered);
    }
  };

  const handleDelete = (groupId: string) => {
    setFilteredGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const handleShare = (groupId: string) => {
    // Implement share functionality
    console.log('Sharing flashcard group:', groupId);
  };

  const handleStudy = (groupId: string) => {
    // Implement study functionality
    console.log('Starting study session for:', groupId);
  };

  const handleEdit = (groupId: string) => {
    // Implement edit functionality
    console.log('Editing flashcard group:', groupId);
  };

  return (
    <div className="bg-white flex flex-col h-full rounded-xl">
      <PageHeader 
        title="Flashcards" 
        icon={Layers} 
        count={filteredGroups.length} 
        countLabel="groups" 
      />

      <PageSearch 
        placeholder="Search flashcard groups..." 
        value={searchQuery} 
        onChange={handleSearch} 
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredGroups.length === 0 ? (
          <PageEmptyState
            icon={Layers}
            title={searchQuery ? 'No flashcard groups found' : 'No flashcard groups yet'}
            description="Create flashcard groups to organize and study mathematical concepts."
            hasSearch={!!searchQuery}
          />
        ) : (
          <FlashcardGroupsList
            groups={filteredGroups}
            onDelete={handleDelete}
            onShare={handleShare}
            onStudy={handleStudy}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}
