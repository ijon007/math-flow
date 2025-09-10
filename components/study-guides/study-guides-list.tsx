'use client';

import { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { StudyGuideCard } from './study-guide-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus
} from 'lucide-react';

interface StudyGuidesListProps {
  onCreateNew?: () => void;
}

export function StudyGuidesList({ onCreateNew }: StudyGuidesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created' | 'progress' | 'title' | 'lastAccessed'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { user } = useUser();
  
  const studyGuides = useQuery(
    api.studyGuides.getStudyGuidesByUser,
    user?.id ? { userId: user.id } : 'skip'
  );
  
  const deleteStudyGuide = useMutation(api.studyGuides.deleteStudyGuide);

  // Filter and sort guides
  const filteredGuides = useMemo(() => {
    if (!studyGuides) return [];

    let filtered = studyGuides.filter(guide => {
      const matchesSearch = searchQuery === '' || 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject = selectedSubject === 'all' || guide.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;

      return matchesSearch && matchesSubject && matchesDifficulty;
    });

    // Sort guides
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'created':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'lastAccessed':
          const aLastAccess = a.lastAccessed || 0;
          const bLastAccess = b.lastAccessed || 0;
          comparison = aLastAccess - bLastAccess;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [studyGuides, searchQuery, selectedSubject, selectedDifficulty, sortBy, sortOrder]);

  const handleDelete = async (guideId: string) => {
    try {
      await deleteStudyGuide({ guideId: guideId as any });
      toast.success('Study guide deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete study guide');
    }
  };

  const handleShare = (guideId: string) => {
    const guideUrl = `${window.location.origin}/chat/guides/${guideId}`;
    navigator.clipboard.writeText(guideUrl);
    toast.success('Study guide link copied to clipboard!');
  };

  const handleStartGuide = (guideId: string) => {
    window.location.href = `/chat/guides/${guideId}`;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedDifficulty('all');
    setSortBy('created');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchQuery !== '' || selectedSubject !== 'all' || selectedDifficulty !== 'all';

  if (!studyGuides) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading study guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search study guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="outline" className="text-xs">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedSubject !== 'all' && (
              <Badge variant="outline" className="text-xs">
                Subject: {selectedSubject}
              </Badge>
            )}
            {selectedDifficulty !== 'all' && (
              <Badge variant="outline" className="text-xs">
                Difficulty: {selectedDifficulty}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {filteredGuides.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {hasActiveFilters ? 'No guides found' : 'No study guides yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms'
                : 'Create your first study guide to get started'
              }
            </p>
            {onCreateNew && !hasActiveFilters && (
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Study Guide
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-3"
        }>
          {filteredGuides.map((guide) => (
            <StudyGuideCard
              key={guide._id}
              guide={guide}
              onStartGuide={handleStartGuide}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
