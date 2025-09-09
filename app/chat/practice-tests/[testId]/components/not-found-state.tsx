'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function NotFoundState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Test Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The practice test you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/chat/practice-tests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Practice Tests
          </Link>
        </Button>
      </div>
    </div>
  );
}
