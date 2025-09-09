'use client';

import { ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TestHeaderProps {
  title: string;
  description?: string;
  onShare: () => void;
}

export function TestHeader({ title, description, onShare }: TestHeaderProps) {
  return (
    <div className="border-b bg-white px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/chat/practice-tests">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          className='hover:bg-[#00C48D]/10 hover:text-[#00C48D] transition-all duration-300'
          onClick={() => onShare()}
          size="icon"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
