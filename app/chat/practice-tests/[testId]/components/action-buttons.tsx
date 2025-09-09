'use client';

import { Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onStartTest: () => void;
  onSaveForLater: () => void;
}

export function ActionButtons({ onStartTest, onSaveForLater }: ActionButtonsProps) {
  return (
    <div className="mt-3 flex justify-center gap-4">
      <Button className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-primary-foreground border-none" onClick={onStartTest}>
        <Play className="mr-2 h-4 w-4" />
        Start Test
      </Button>
      <Button variant="outline" onClick={onSaveForLater}>
        <Save className="mr-2 h-4 w-4" />
        Save for Later
      </Button>
    </div>
  );
}
