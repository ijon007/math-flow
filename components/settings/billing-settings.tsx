'use client';

import { Check, Crown, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function BillingSettings() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="mb-2 font-medium text-lg">Current Plan</h3>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Free Plan</CardTitle>
                <CardDescription>
                  Basic features for learning math
                </CardDescription>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Monthly usage</span>
                <span>150 / 200 requests</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Flashcards created</span>
                <span>45 / 100</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Graphs generated</span>
                <span>23 / 50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-lg">Upgrade Plans</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-2 border-orange-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <CardTitle className="text-base">Pro</CardTitle>
                </div>
                <Badge variant="outline">$9/month</Badge>
              </div>
              <CardDescription>Perfect for students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Unlimited requests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>500 flashcards/month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>200 graphs/month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Priority support</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="h-4 w-4 text-purple-500" />
                  <CardTitle className="text-base">Premium</CardTitle>
                </div>
                <Badge variant="outline">$19/month</Badge>
              </div>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Unlimited everything</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Advanced visualizations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>API access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
              <Button className="w-full" size="sm" variant="outline">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-lg">Billing History</h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-1 text-sm">
            <span>No billing history</span>
            <Button size="sm" variant="ghost">
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
