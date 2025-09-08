'use client';

import { SignOutButton } from '@clerk/nextjs';
import { Calendar, LogOut, Mail, Shield, Trash2, User } from 'lucide-react';
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
        <h2 className="font-semibold text-2xl text-neutral-900 dark:text-white">
          Account Information
        </h2>
        <p className="mt-1 text-neutral-600 text-sm dark:text-neutral-400">
          Your profile details and preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <Avatar className="h-12 w-12">
            <AvatarImage alt={user.name} src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-neutral-900 dark:text-white">
              {user.name}
            </h3>
            <p className="truncate text-neutral-600 text-sm dark:text-neutral-400">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="mb-1 flex items-center space-x-2">
            <h3 className="font-medium text-lg text-neutral-900 dark:text-white">
              Danger Zone
            </h3>
          </div>
          <p className="mb-4 text-neutral-600 text-sm dark:text-neutral-400">
            Be careful with these actions. They cannot be undone.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-red-50/50 p-4 dark:bg-red-900/10">
              <div>
                <p className="font-medium text-red-500 text-sm">
                  Delete Account
                </p>
                <p className="text-black text-xs">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                className="border-none bg-red-500/20 text-red-500 hover:bg-red-500/30"
                size="sm"
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-red-50/50 p-4 dark:bg-red-900/10">
              <div>
                <p className="font-medium text-red-500 text-sm">Sign Out</p>
                <p className="text-black text-xs">
                  Sign out of your account on this device
                </p>
              </div>
              <SignOutButton>
                <Button
                  className="border-none bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  size="sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
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
