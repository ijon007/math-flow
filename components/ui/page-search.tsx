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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-9 bg-white border-neutral-200 focus:border-[#00C48D] focus:ring-[#00C48D]/20"
        />
      </div>
    </div>
  );
}
