'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import {
  Calculator,
  FunctionSquare,
  PieChart,
  Plus,
  SendIcon,
  Sigma,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  ChartSplineIcon,
  type ChartSplineIconHandle,
} from '@/components/ui/chart-spline';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { cn } from '@/lib/utils';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';
import { Button } from '../ui/button';

export function HeroSection() {
  const [input, setInput] = useState('');
  const clockRef = useRef<ClockIconHandle>(null);
  const chartRef = useRef<ChartSplineIconHandle>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Redirect to chat page with the input
      router.push(`/chat?q=${encodeURIComponent(input)}`);
    }
  };

  const handleStepsHover = () => {
    clockRef.current?.startAnimation();
  };

  const handleStepsLeave = () => {
    clockRef.current?.stopAnimation();
  };

  const handleGraphHover = () => {
    chartRef.current?.startAnimation();
  };

  const handleGraphLeave = () => {
    chartRef.current?.stopAnimation();
  };

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white"
      id="hero"
    >
      <div className="absolute inset-0">
        <AnimatedGridPattern
          className={cn(
            '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-0 h-full w-full'
          )}
          duration={3}
          maxOpacity={0.1}
          numSquares={30}
          repeatDelay={1}
        />

        {/* Floating Math Icons */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          className="absolute top-32 left-80 z-20 text-[#00C48D]/40"
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <Calculator size={32} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -8, 0],
          }}
          className="absolute top-40 right-80 z-20 text-[#00C48D]/35"
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <FunctionSquare size={28} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 12, 0],
          }}
          className="absolute top-48 left-72 z-20 text-[#00C48D]/30"
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <PieChart size={24} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 12, 0],
            rotate: [0, -6, 0],
          }}
          className="absolute right-72 bottom-48 z-20 text-[#00C48D]/38"
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        >
          <Sigma size={30} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          className="absolute bottom-40 left-80 z-20 text-[#00C48D]/32"
          transition={{
            duration: 5.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 1.5,
          }}
        >
          <Plus size={26} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 8, 0],
            rotate: [0, -15, 0],
          }}
          className="absolute top-56 right-80 z-20 text-[#00C48D]/34"
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 2.5,
          }}
        >
          <X size={22} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, 0],
          }}
          className="absolute bottom-52 left-72 z-20 text-[#00C48D]/36"
          transition={{
            duration: 4.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 3,
          }}
        >
          <Calculator size={20} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 18, 0],
            rotate: [0, -12, 0],
          }}
          className="absolute top-44 right-72 z-20 text-[#00C48D]/33"
          transition={{
            duration: 6.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        >
          <FunctionSquare size={18} />
        </motion.div>
      </div>
      <div className="container relative z-10 mx-auto w-full px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center justify-center gap-16 text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="font-bold font-lora text-5xl text-black tracking-tight md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Never fail math class
              <br />
              <span className="bg-gradient-to-r from-black to-black/70 bg-clip-text text-transparent">
                ever again
              </span>
            </motion.h1>

            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-base text-neutral-600 leading-relaxed sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Take control with Math Flow's AI-powered math assistant. Solve
              problems, create graphs, and study with flashcards.
            </motion.p>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto w-full max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SignedIn>
                <PromptInput onSubmit={handleSubmit}>
                  <PromptInputTextarea
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about math..."
                    value={input}
                  />
                  <PromptInputToolbar>
                    <PromptInputTools>
                      <PromptInputButton
                        className="opacity-50"
                        onMouseEnter={handleStepsHover}
                        onMouseLeave={handleStepsLeave}
                        variant="outline"
                      >
                        <ClockIcon className="h-4 w-4" ref={clockRef} />
                        <span>Steps</span>
                      </PromptInputButton>
                      <PromptInputButton
                        className="opacity-50"
                        onMouseEnter={handleGraphHover}
                        onMouseLeave={handleGraphLeave}
                        variant="outline"
                      >
                        <ChartSplineIcon className="h-4 w-4" ref={chartRef} />
                        <span>Graph</span>
                      </PromptInputButton>
                    </PromptInputTools>
                    <PromptInputSubmit className="bg-[#00C48D] hover:bg-[#00C48D]/80" />
                  </PromptInputToolbar>
                </PromptInput>
              </SignedIn>

              <SignedOut>
                <PromptInput onSubmit={(e) => e.preventDefault()}>
                  <PromptInputTextarea
                    disabled
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Sign in to start solving problems..."
                    value={input}
                  />
                  <PromptInputToolbar>
                    <PromptInputTools>
                      <PromptInputButton
                        className="opacity-50"
                        variant="outline"
                      >
                        <ClockIcon className="h-4 w-4" ref={clockRef} />
                        <span>Steps</span>
                      </PromptInputButton>
                      <PromptInputButton
                        className="opacity-50"
                        variant="outline"
                      >
                        <ChartSplineIcon className="h-4 w-4" ref={chartRef} />
                        <span>Graph</span>
                      </PromptInputButton>
                    </PromptInputTools>
                    <Link href="/chat">
                      <Button
                        className="rounded-md bg-[#00C48D] px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-[#00C48D]/80"
                        size="icon"
                      >
                        <SendIcon className="size-4" />
                      </Button>
                    </Link>
                  </PromptInputToolbar>
                </PromptInput>
              </SignedOut>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
