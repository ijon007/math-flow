'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function AgentSettings() {
  const [responseDetail, setResponseDetail] = useState([2]);
  const [explanationStyle, setExplanationStyle] = useState('mixed');

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="mb-4 font-semibold text-xl">AI Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="font-medium text-sm">Response Detail Level</Label>
            <div className="mt-3 px-1">
              <Slider
                className="w-full"
                max={3}
                min={1}
                onValueChange={setResponseDetail}
                step={1}
                value={responseDetail}
              />
              <div className="mt-1 flex justify-between text-muted-foreground text-xs">
                <span>Concise</span>
                <span>Detailed</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="font-medium text-sm">Explanation Style</Label>
            <Select
              onValueChange={setExplanationStyle}
              value={explanationStyle}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner-friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-xl">Learning Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-sm">Default Difficulty</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
