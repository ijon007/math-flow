'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { BookmarksList } from '@/components/bookmarks/bookmarks-list';
import { PageEmptyState } from '@/components/ui/page-empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageSearch } from '@/components/ui/page-search';
import type { Bookmark as BookmarkType } from '@/constants/bookmarks';
import { api } from '@/convex/_generated/api';

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const bookmarkedThreads = useQuery(
    api.threads.getBookmarkedThreads,
    user?.id ? { userId: user.id } : 'skip'
  );
  const deleteThread = useMutation(api.threads.deleteThread);

  // Convert threads to bookmark format for existing components
  const bookmarks: BookmarkType[] =
    bookmarkedThreads?.map((thread) => ({
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
      const filtered = bookmarks.filter(
        (chat) =>
          chat.title.toLowerCase().includes(query.toLowerCase()) ||
          chat.preview.toLowerCase().includes(query.toLowerCase()) ||
          chat.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );
      setFilteredChats(filtered);
    }
  };

  const handleDelete = async (chatId: string) => {
    await deleteThread({ threadId: chatId as any });
    setFilteredChats((prev) => prev.filter((chat) => chat.id !== chatId));
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
    <div className="flex h-full flex-col rounded-xl bg-white">
      <PageHeader
        count={filteredChats.length}
        countLabel="saved"
        icon={Bookmark}
        title="Bookmarks"
      />

      <PageSearch
        onChange={handleSearch}
        placeholder="Search bookmarks..."
        value={searchQuery}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredChats.length === 0 ? (
          <PageEmptyState
            description="Bookmark your favorite conversations to easily find them later."
            hasSearch={!!searchQuery}
            icon={Bookmark}
            title={searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
          />
        ) : (
          <BookmarksList
            bookmarks={filteredChats}
            onClick={handleClick}
            onDelete={handleDelete}
            onRename={handleRename}
            onShare={handleShare}
          />
        )}
      </div>
    </div>
  );
}
