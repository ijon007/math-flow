'use client';

import type { Bookmark } from '@/constants/bookmarks';
import { BookmarkCard } from './bookmark-card';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function BookmarksList({
  bookmarks,
  onDelete,
  onClick,
}: BookmarksListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          bookmark={bookmark}
          key={bookmark.id}
          onClick={onClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
