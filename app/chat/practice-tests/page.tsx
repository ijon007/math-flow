'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { BookOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { api } from '@/convex/_generated/api';

interface PracticeTestGroup {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  createdAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  tags: string[];
  lastTaken: string;
  attempts: number;
  averageScore: number;
  timeLimit?: number;
  isPublic: boolean;
}

export default function PracticeTestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const practiceTests = useQuery(
    api.practiceTests.getPracticeTestsByUser,
    user?.id ? { userId: user.id } : 'skip'
  );
  const deletePracticeTest = useMutation(api.practiceTests.deletePracticeTest);

  // Convert to existing PracticeTestGroup format
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

  // Update filtered groups when practice tests data changes
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
    // Copy test URL to clipboard
    const testUrl = `${window.location.origin}/chat/practice-tests/${groupId}`;
    navigator.clipboard.writeText(testUrl);
    toast.success('Test link copied to clipboard!');
  };

  const handleTakeTest = (groupId: string) => {
    // Navigate to test taking interface
    window.location.href = `/chat/practice-tests/${groupId}`;
  };

  const handleEdit = (groupId: string) => {
    toast.info('Edit functionality coming soon!');
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <PageHeader
        count={filteredGroups.length}
        countLabel="tests"
        icon={BookOpen}
        title="Practice Tests"
      />

      <PageSearch
        onChange={handleSearch}
        placeholder="Search practice tests..."
        value={searchQuery}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredGroups.length === 0 ? (
          <PageEmptyState
            description="Create practice tests to assess your mathematical knowledge and prepare for exams."
            hasSearch={!!searchQuery}
            icon={BookOpen}
            title={
              searchQuery
                ? 'No practice tests found'
                : 'No practice tests yet'
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none tracking-tight">
                        {group.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          group.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : group.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {group.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">{group.subject}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{group.questionCount}</span>
                    </div>
                    {group.timeLimit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Time Limit:</span>
                        <span className="font-medium">
                          {group.timeLimit < 60
                            ? `${group.timeLimit} min`
                            : `${Math.floor(group.timeLimit / 60)}h ${group.timeLimit % 60}m`}
                        </span>
                      </div>
                    )}
                    {group.attempts > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Average Score:</span>
                        <span className="font-medium">{group.averageScore.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      onClick={() => handleTakeTest(group.id)}
                    >
                      Take Test
                    </button>
                    <button
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleEdit(group.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleShare(group.id)}
                    >
                      Share
                    </button>
                    <button
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(group.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
