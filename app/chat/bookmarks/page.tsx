'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { BookmarksList } from '@/components/bookmarks/bookmarks-list';
import type { Bookmark as BookmarkType } from '@/constants/bookmarks';

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const bookmarkedThreads = useQuery(api.threads.getBookmarkedThreads, 
    user?.id ? { userId: user.id } : "skip"
  );
  const deleteThread = useMutation(api.threads.deleteThread);

  // Convert threads to bookmark format for existing components
  const bookmarks: BookmarkType[] = bookmarkedThreads?.map(thread => ({
    id: thread._id,
    title: thread.title,
    preview: thread.preview || '',
    lastModified: new Date(thread.updatedAt).toLocaleDateString(),
    messageCount: thread.messageCount,
    tags: thread.tags,
    isBookmarked: thread.isBookmarked,
  })) || [];

  const [filteredChats, setFilteredChats] = useState<BookmarkType[]>(bookmarks);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChats(bookmarks);
    } else {
      const filtered = bookmarks.filter(chat =>
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.preview.toLowerCase().includes(query.toLowerCase()) ||
        chat.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredChats(filtered);
    }
  };

  const handleDelete = async (chatId: string) => {
    await deleteThread({ threadId: chatId as any });
    setFilteredChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const handleShare = (chatId: string) => {
    // Implement share functionality
    console.log('Sharing chat:', chatId);
  };

  const handleRename = (chatId: string) => {
    // Implement rename functionality
    console.log('Renaming chat:', chatId);
  };

  const handleClick = (chatId: string) => {
    window.location.href = `/chat?thread=${chatId}`;
  };

  return (
    <div className="bg-white flex flex-col h-full rounded-xl">
      <PageHeader 
        title="Bookmarks" 
        icon={Bookmark} 
        count={filteredChats.length} 
        countLabel="saved" 
      />

      <PageSearch 
        placeholder="Search bookmarks..." 
        value={searchQuery} 
        onChange={handleSearch} 
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredChats.length === 0 ? (
          <PageEmptyState
            icon={Bookmark}
            title={searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
            description="Bookmark your favorite conversations to easily find them later."
            hasSearch={!!searchQuery}
          />
        ) : (
          <BookmarksList
            bookmarks={filteredChats}
            onDelete={handleDelete}
            onShare={handleShare}
            onRename={handleRename}
            onClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}
