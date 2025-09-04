import { useState } from 'react';

export type TabType = 'steps' | 'graph' | '';

export function useTabManagement() {
  const [activeTabs, setActiveTabs] = useState<Set<TabType>>(new Set(['']));

  const toggleTab = (tab: 'steps' | 'graph') => {
    setActiveTabs(prev => {
      const newTabs = new Set(prev);
      if (newTabs.has(tab)) {
        newTabs.delete(tab);
      } else {
        newTabs.add(tab);
      }
      return newTabs;
    });
  };

  return {
    activeTabs,
    toggleTab
  };
}
