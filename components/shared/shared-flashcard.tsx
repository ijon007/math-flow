'use client';

import { BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlashcardComponent } from '@/components/flashcards/flashcard';

interface SharedFlashcardProps {
  flashcard: any; // Flashcard type from Convex
}

export function SharedFlashcard({ flashcard }: SharedFlashcardProps) {
  const flashcardData = {
    type: 'flashcards' as const,
    topic: flashcard.topic,
    count: flashcard.cards.length,
    difficulty: flashcard.difficulty,
    cards: flashcard.cards,
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              {flashcard.topic}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{flashcard.cards.length} cards</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Shared</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              className={`text-xs ${
                flashcard.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800'
                  : flashcard.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
              variant="outline"
            >
              {flashcard.difficulty === 'easy'
                ? 'Beginner'
                : flashcard.difficulty === 'medium'
                  ? 'Intermediate'
                  : 'Advanced'}
            </Badge>
            {flashcard.subject && (
              <Badge variant="secondary" className="text-xs">
                {flashcard.subject}
              </Badge>
            )}
          </div>
          
          <div className="rounded-lg border bg-white p-4">
            <FlashcardComponent data={flashcardData} />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-600">
              Study these flashcards interactively by signing in above
            </p>
          </div>

          {flashcard.tags && flashcard.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {flashcard.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center">
            <p className="mb-3 text-sm text-neutral-600">
              Want to study these flashcards? Sign in to save them to your library.
            </p>
            <Button
              onClick={() => {
                // Store the shared item info in localStorage for after sign-in
                localStorage.setItem('sharedItem', JSON.stringify({
                  type: 'flashcard',
                  id: flashcard._id,
                  redirectTo: `/chat/flashcards`
                }));
                // Redirect to sign in
                window.location.href = '/chat';
              }}
              className="bg-[#00C48D] hover:bg-[#00C48D]/90 text-white border-none"
              size="sm"
            >
              Sign In to Study
            </Button>
          </div>
          <p className="text-sm text-neutral-500">
            This flashcard set was shared from Math Flow
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
