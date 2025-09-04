'use client';

import { Calendar, Download, MoreHorizontal, Share, Trash2, Edit, Eye, ChartSpline } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Graph } from '@/constants/graphs';

interface GraphCardProps {
  graph: Graph;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

export function GraphCard({ graph, onDelete, onShare, onDownload, onView }: GraphCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-neutral-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-neutral-900 mb-1 truncate">
              {graph.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
              <Calendar className="h-3 w-3" />
              <span>{graph.createdAt}</span>
              <Badge variant="outline" className="text-xs">
                {graph.type}
              </Badge>
            </div>
          </div>
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
              <DropdownMenuItem onClick={() => onView(graph.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(graph.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(graph.id)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(graph.id)}
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
        {/* Graph Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-[#00C48D]/10 to-[#00C48D]/5 rounded-lg mb-3 flex items-center justify-center border border-neutral-200">
          <ChartSpline className="h-8 w-8 text-[#00C48D]/60" />
        </div>
        
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {graph.description}
        </p>
        
        <div className="bg-neutral-50 rounded-md p-2 mb-3">
          <code className="text-xs font-mono text-neutral-700">
            {graph.equation}
          </code>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {graph.tags.map((tag) => (
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
