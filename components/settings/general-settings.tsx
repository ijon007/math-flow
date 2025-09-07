'use client';

import { SignOutButton } from '@clerk/nextjs';
import { LogOut, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function GeneralSection({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  return (
    <div className="space-y-4 p-4 sm:space-y-6">
      <div className="sr-only">
        <h3 className="mb-2 font-semibold text-lg text-neutral-900 sm:text-xl dark:text-white">
          Profile
        </h3>
        <p className="text-neutral-600 text-sm sm:text-base dark:text-neutral-400">
          Your account information and preferences.
        </p>
      </div>

      <Card className="mt-5 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-neutral-900 sm:text-lg dark:text-white">
            Account Information
          </CardTitle>
          <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
            Your profile details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={user.name} src={user.avatar} />
              <AvatarFallback className="bg-neutral-100 text-lg dark:bg-neutral-800">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="w-full flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-medium text-neutral-900 text-sm dark:text-white">
                    Name
                  </Label>
                  <p className="text-neutral-700 text-sm dark:text-neutral-300">
                    {user.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-neutral-900 text-sm dark:text-white">
                    Email
                  </Label>
                  <p className="break-all text-neutral-700 text-sm dark:text-neutral-300">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <CardHeader className="pb-0">
          <CardTitle className="text-base text-neutral-900 sm:text-lg dark:text-white">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
            Be careful with these actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-black text-sm dark:text-white">
                Delete Account
              </span>
              <Button className="rounded-sm border-none bg-red-500/10 text-red-500 hover:bg-red-500/20">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-black text-sm dark:text-white">
                Logout
              </span>
              <SignOutButton>
                <Button className="rounded-sm border-none bg-red-500/10 text-red-500 hover:bg-red-500/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </SignOutButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
