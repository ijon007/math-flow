'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { Layers } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FlashcardGroupsList } from '@/components/flashcards/flashcard-groups-list';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import type { FlashcardGroup } from '@/constants/flashcards';
import { api } from '@/convex/_generated/api';

export default function FlashcardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const flashcards = useQuery(
    api.flashcards.getFlashcardsByUser,
    user?.id ? { userId: user.id } : 'skip'
  );
  const deleteFlashcard = useMutation(api.flashcards.deleteFlashcard);

  // Convert to existing FlashcardGroup format and filter out empty groups
  const formattedGroups: FlashcardGroup[] = useMemo(() => {
    return (
      flashcards
        ?.filter((flashcard) => flashcard.cards && flashcard.cards.length > 0) // Only show groups with cards
        ?.map((flashcard) => ({
          id: flashcard._id,
          title: flashcard.topic,
          description: `${flashcard.cards.length} cards`,
          cardCount: flashcard.cards.length,
          createdAt: new Date(flashcard.createdAt).toLocaleDateString(),
          difficulty:
            flashcard.difficulty === 'easy'
              ? 'Beginner'
              : flashcard.difficulty === 'medium'
                ? 'Intermediate'
                : 'Advanced',
          subject: flashcard.subject || 'Math',
          tags: flashcard.tags,
          lastStudied: flashcard.lastStudied
            ? new Date(flashcard.lastStudied).toLocaleDateString()
            : '',
          mastery: flashcard.mastery,
          // Pass the actual flashcard data
          flashcardData: {
            type: 'flashcards' as const,
            topic: flashcard.topic,
            count: flashcard.cards.length,
            difficulty: flashcard.difficulty,
            cards: flashcard.cards,
          },
        })) || []
    );
  }, [flashcards]);

  const [filteredGroups, setFilteredGroups] =
    useState<FlashcardGroup[]>(formattedGroups);

  // Update filtered groups when flashcards data changes
  useEffect(() => {
    setFilteredGroups(formattedGroups);
  }, [formattedGroups]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGroups(formattedGroups);
    } else {
      const filtered = formattedGroups.filter(
        (group) =>
          group.title.toLowerCase().includes(query.toLowerCase()) ||
          group.description.toLowerCase().includes(query.toLowerCase()) ||
          group.subject.toLowerCase().includes(query.toLowerCase()) ||
          group.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );
      setFilteredGroups(filtered);
    }
  };

  const handleDelete = async (groupId: string) => {
    await deleteFlashcard({ flashcardId: groupId as any });
    setFilteredGroups((prev) => prev.filter((group) => group.id !== groupId));
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
    <div className="flex h-full flex-col rounded-xl bg-white">
      <PageHeader
        count={filteredGroups.length}
        countLabel="groups"
        icon={Layers}
        title="Flashcards"
      />

      <PageSearch
        onChange={handleSearch}
        placeholder="Search flashcard groups..."
        value={searchQuery}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredGroups.length === 0 ? (
          <PageEmptyState
            description="Create flashcard groups to organize and study mathematical concepts."
            hasSearch={!!searchQuery}
            icon={Layers}
            title={
              searchQuery
                ? 'No flashcard groups found'
                : 'No flashcard groups yet'
            }
          />
        ) : (
          <FlashcardGroupsList
            groups={filteredGroups}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onShare={handleShare}
            onStudy={handleStudy}
          />
        )}
      </div>
    </div>
  );
}
