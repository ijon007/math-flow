'use client';

import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ripple } from '../magicui/ripple';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:mx-30">
      <Ripple />
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 font-semibold text-4xl leading-[1.1] tracking-tight lg:text-6xl text-black">
            <span>Study smarter, not harder</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-black/70 text-xl leading-relaxed">
            Math Flow is an AI-powered tool that helps you learn math faster and easier.
            Flashcards, graphs, step-by-step explanations and more.
          </p>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group rounded-full bg-black px-8 py-6 font-semibold text-white hover:bg-black/90"
              size="lg"
            >
              <Link href="/chat" target="_blank">
                Start learning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
