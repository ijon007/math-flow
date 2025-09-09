'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeLimit: number; // in minutes
  onTimeUp: () => void;
  isActive: boolean;
  className?: string;
}

export function Timer({ timeLimit, onTimeUp, isActive, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <Card className={cn(
      "w-fit",
      isCritical && "border-red-500 bg-red-50",
      isWarning && !isCritical && "border-orange-500 bg-orange-50",
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className={cn(
            "font-mono text-sm font-medium",
            isCritical && "text-red-600",
            isWarning && !isCritical && "text-orange-600"
          )}>
            {formatTime(timeLeft)}
          </span>
        </div>
        {isWarning && (
          <p className={cn(
            "text-xs mt-1",
            isCritical ? "text-red-600" : "text-orange-600"
          )}>
            {isCritical ? "Time almost up!" : "Time running low"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
