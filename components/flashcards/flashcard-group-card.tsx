'use client';

import { Calendar, Play, MoreHorizontal, Share, Trash2, Edit, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FlashcardGroup } from '@/constants/flashcards';

interface FlashcardGroupCardProps {
  group: FlashcardGroup;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onStudy: (id: string) => void;
  onEdit: (id: string) => void;
}

export function FlashcardGroupCard({ group, onDelete, onShare, onStudy, onEdit }: FlashcardGroupCardProps) {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (mastery >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-neutral-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-neutral-900 mb-1 truncate">
              {group.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{group.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{group.cardCount} cards</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Last studied: {group.lastStudied}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onStudy(group.id)}
              className="bg-[#00C48D] hover:bg-[#00C48D]/80 text-white border-none h-8"
            >
              <Play className="h-3 w-3 mr-1" />
              Study
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(group.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(group.id)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(group.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {group.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getDifficultyColor(group.difficulty)}`}
            >
              {group.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {group.subject}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Mastery:</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getMasteryColor(group.mastery)}`}
            >
              {group.mastery}%
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {group.tags.map((tag) => (
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
