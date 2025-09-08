'use client';

import {
  Calendar,
  Edit,
  MessageSquare,
  MoreHorizontal,
  Share,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Bookmark } from '@/constants/bookmarks';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onRename: (id: string) => void;
  onClick: (id: string) => void;
  index: number;
}

export function BookmarkCard({
  bookmark,
  onDelete,
  onShare,
  onRename,
  onClick,
  index,
}: BookmarkCardProps) {
  return (
    <div
      className="group cursor-pointer rounded-lg border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-sm"
      onClick={() => onClick(bookmark.id)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 truncate font-semibold text-neutral-900 text-sm">
              {bookmark.title}
            </h3>
            <div className="flex items-center gap-4 text-neutral-500 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{bookmark.lastModified}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{bookmark.messageCount} messages</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-6 w-6 text-neutral-400 opacity-0 transition-opacity duration-200 hover:bg-neutral-100 hover:text-neutral-600 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontal className="h-3 w-3" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(bookmark.id);
                }}
              >
                <Edit className="mr-2 h-3 w-3" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(bookmark.id);
                }}
              >
                <Share className="mr-2 h-3 w-3" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(bookmark.id);
                }}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
