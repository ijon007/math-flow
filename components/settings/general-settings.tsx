'use client';

import { SignOutButton } from '@clerk/nextjs';
import { LogOut, Trash2, User, Mail, Calendar, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function GeneralSection({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Account Information
        </h2>
        <p className="text-neutral-600 text-sm mt-1 dark:text-neutral-400">
          Your profile details and preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Avatar className="h-12 w-12">
            <AvatarImage alt={user.name} src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-neutral-900 dark:text-white truncate">
              {user.name}
            </h3>
            <p className="text-neutral-600 text-sm dark:text-neutral-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Danger Zone</h3>
          </div>
          <p className="text-neutral-600 text-sm dark:text-neutral-400 mb-4">
            Be careful with these actions. They cannot be undone.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-red-50/50 dark:bg-red-900/10">
              <div>
                <p className="font-medium text-sm text-red-500">Delete Account</p>
                <p className="text-black text-xs">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                className="text-red-500 bg-red-500/20 hover:bg-red-500/30 border-none"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-red-50/50 dark:bg-red-900/10">
              <div>
                <p className="font-medium text-sm text-red-500">Sign Out</p>
                <p className="text-black text-xs">Sign out of your account on this device</p>
              </div>
              <SignOutButton>
                <Button 
                  size="sm"
                  className="text-red-500 bg-red-500/20 hover:bg-red-500/30 border-none"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
