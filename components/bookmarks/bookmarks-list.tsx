'use client';

import { BookmarkCard } from './bookmark-card';
import type { Bookmark } from '@/constants/bookmarks';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onRename: (id: string) => void;
  onClick: (id: string) => void;
}

export function BookmarksList({ bookmarks, onDelete, onShare, onRename, onClick }: BookmarksListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark, index) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onShare={onShare}
          onRename={onRename}
          onClick={onClick}
          index={index}
        />
      ))}
    </div>
  );
}
