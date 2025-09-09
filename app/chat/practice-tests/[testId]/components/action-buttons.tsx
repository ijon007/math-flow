'use client';

import { Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onStartTest: () => void;
  onSaveForLater: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ActionButtons({ onStartTest, onSaveForLater, isLoading = false, disabled = false }: ActionButtonsProps) {
  return (
    <div className="mt-3 flex justify-center gap-4">
      <Button 
        className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-primary-foreground border-none" 
        onClick={onStartTest}
        disabled={disabled || isLoading}
      >
        <Play className="mr-2 h-4 w-4" />
        {isLoading ? 'Starting...' : 'Start Test'}
      </Button>
      <Button 
        variant="outline" 
        onClick={onSaveForLater}
        disabled={disabled || isLoading}
      >
        <Save className="mr-2 h-4 w-4" />
        Save for Later
      </Button>
    </div>
  );
}
