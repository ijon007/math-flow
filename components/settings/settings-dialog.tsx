'use client';

import { Bot, CreditCard, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AgentSettings } from './agent-settings';
import { BillingSettings } from './billing-settings';
import { GeneralSection } from './general-settings';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const settingsTabs = [
  { id: 'general', label: 'General', icon: User },
  { id: 'agent', label: 'Agent', icon: Bot },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export function SettingsDialog({
  open,
  onOpenChange,
  user,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState('general');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSection user={user} />;
      case 'agent':
        return <AgentSettings />;
      case 'billing':
        return <BillingSettings />;
      default:
        return <GeneralSection user={user} />;
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="h-[600px] w-[1000px] p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          <div className="w-48 border-r bg-neutral-50/50">
            <nav className="p-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    className="mb-1 h-9 w-full justify-start"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 overflow-auto">{renderTabContent()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
