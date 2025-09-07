'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PageSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function PageSearch({ placeholder, value, onChange }: PageSearchProps) {
  return (
    <div className="px-4 py-3">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-neutral-400" />
        <Input
          className="h-9 border-neutral-200 bg-white pl-10 focus:border-[#00C48D] focus:ring-[#00C48D]/20"
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
