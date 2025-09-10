'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { PracticeTestGroup } from '../lib/types';

export function usePracticeTestsData() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const practiceTests = useQuery(
    api.practiceTests.getPracticeTestsByUser,
    user?.id ? { userId: user.id } : 'skip'
  );
  const deletePracticeTest = useMutation(api.practiceTests.deletePracticeTest);

  const formattedGroups: PracticeTestGroup[] = useMemo(() => {
    return (
      practiceTests
        ?.filter((test) => test.questions && test.questions.length > 0)
        ?.map((test) => ({
          id: test._id,
          title: test.title,
          description: test.description || `${test.questionCount} questions`,
          questionCount: test.questionCount,
          createdAt: new Date(test.createdAt).toLocaleDateString(),
          difficulty:
            test.difficulty === 'easy'
              ? 'Easy'
              : test.difficulty === 'medium'
                ? 'Medium'
                : 'Hard',
          subject: test.subject,
          tags: test.tags,
          lastTaken: test.lastTaken
            ? new Date(test.lastTaken).toLocaleDateString()
            : '',
          attempts: test.attempts,
          averageScore: test.averageScore,
          timeLimit: test.timeLimit,
          isPublic: test.isPublic,
        })) || []
    );
  }, [practiceTests]);

  const [filteredGroups, setFilteredGroups] = useState<PracticeTestGroup[]>(formattedGroups);

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
    try {
      await deletePracticeTest({ testId: groupId as any });
      setFilteredGroups((prev) => prev.filter((group) => group.id !== groupId));
      toast.success('Practice test deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete practice test');
    }
  };

  const handleShare = (groupId: string) => {
    const testUrl = `${window.location.origin}/chat/practice-tests/${groupId}`;
    navigator.clipboard.writeText(testUrl);
    toast.success('Test link copied to clipboard!');
  };

  const handleTakeTest = (groupId: string) => {
    window.location.href = `/chat/practice-tests/${groupId}`;
  };

  return {
    searchQuery,
    filteredGroups,
    handleSearch,
    handleDelete,
    handleShare,
    handleTakeTest,
  };
}
