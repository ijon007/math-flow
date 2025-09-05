'use client';

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


export function GeneralSection({ user }: { user: { name: string; email: string; avatar: string } }) {

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className='sr-only'>
        <h3 className="mb-2 font-semibold text-neutral-900 text-lg sm:text-xl dark:text-white">
          Profile
        </h3>
        <p className="text-neutral-600 text-sm sm:text-base dark:text-neutral-400">
          Your account information and preferences.
        </p>
      </div>

      <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 mt-5">
        <CardHeader className="pb-4">
          <CardTitle className="text-neutral-900 text-base sm:text-lg dark:text-white">
            Account Information
          </CardTitle>
          <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
            Your profile details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={user.name} src={user.avatar} />
              <AvatarFallback className="bg-neutral-100 text-lg dark:bg-neutral-800">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 w-full">
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
                  <p className="text-neutral-700 text-sm dark:text-neutral-300 break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 mt-5">
        <CardHeader className="pb-0">
          <CardTitle className="text-neutral-900 text-base sm:text-lg dark:text-white">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
            Be careful with these actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-black font-medium dark:text-white">Delete Account</span>
              <Button className="rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-black font-medium dark:text-white">Logout</span>
              <Button className="rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}