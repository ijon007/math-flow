'use client';

import { BookmarkCard } from './bookmark-card';
import type { Bookmark } from '@/constants/bookmarks';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onRename: (id: string) => void;
}

export function BookmarksList({ bookmarks, onDelete, onShare, onRename }: BookmarksListProps) {
  return (
    <div className="grid gap-3 max-w-4xl mx-auto">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onShare={onShare}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
