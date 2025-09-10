'use client';

import { useRef } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FlaskIcon, type FlaskIconHandle } from '@/components/ui/flask';

interface TestHeaderProps {
  title: string;
  description?: string;
  onShare: () => void;
  showTakeTest?: boolean;
  onTakeTest?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function TestHeader({ 
  title, 
  description, 
  onShare, 
  showTakeTest = false, 
  onTakeTest, 
  isSubmitting = false, 
  disabled = false 
}: TestHeaderProps) {
  const flaskRef = useRef<FlaskIconHandle>(null);
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className='hover:bg-[#00C48D]/10 hover:text-[#00C48D] transition-all duration-300'
            onClick={() => onShare()}
            size="icon"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={onTakeTest}
            disabled={disabled || isSubmitting}
            className="flex items-center gap-2 bg-[#00C48D] hover:bg-[#00C48D]/90 text-primary-foreground border-none"
            onMouseEnter={() => flaskRef.current?.startAnimation()}
            onMouseLeave={() => flaskRef.current?.stopAnimation()}
          >
            <FlaskIcon ref={flaskRef} className="h-4 w-4" />
            {isSubmitting ? 'Starting...' : 'Take Test'}
          </Button>
        </div>
      </div>
    </div>
  );
}
