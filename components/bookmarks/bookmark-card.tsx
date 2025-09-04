'use client';

import { Calendar, MessageSquare, MoreHorizontal, Share, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

export function BookmarkCard({ bookmark, onDelete, onShare, onRename }: BookmarkCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-neutral-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-neutral-900 mb-1 truncate">
              {bookmark.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
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
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onRename(bookmark.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(bookmark.id)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(bookmark.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {bookmark.preview}
        </p>
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-[#00C48D]/10 text-[#00C48D] border-[#00C48D]/20 hover:bg-[#00C48D]/20"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
