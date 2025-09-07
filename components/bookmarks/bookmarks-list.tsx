'use client';

import type { Bookmark } from '@/constants/bookmarks';
import { BookmarkCard } from './bookmark-card';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onRename: (id: string) => void;
  onClick: (id: string) => void;
}

export function BookmarksList({
  bookmarks,
  onDelete,
  onShare,
  onRename,
  onClick,
}: BookmarksListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark, index) => (
        <BookmarkCard
          bookmark={bookmark}
          index={index}
          key={bookmark.id}
          onClick={onClick}
          onDelete={onDelete}
          onRename={onRename}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
