'use client'

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useState, useRef } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { ClockIcon, type ClockIconHandle } from '@/components/ui/clock';
import { ChartSplineIcon, type ChartSplineIconHandle } from '@/components/ui/chart-spline';

export function HeroSection() {
    const [input, setInput] = useState('');
    const clockRef = useRef<ClockIconHandle>(null);
    const chartRef = useRef<ChartSplineIconHandle>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            // Redirect to chat page with the input
            window.location.href = `/chat?q=${encodeURIComponent(input)}`;
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
            <div className="container relative z-10 mx-auto w-full px-6 lg:px-8 xl:px-12">
                <div className="flex flex-col items-center justify-center gap-16 text-center">
                    <motion.div
                        className="space-y-8 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.h1
                            className="font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-black font-lora"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Never fail math class
                            <br />
                            <span className="bg-gradient-to-r from-black to-black/70 bg-clip-text text-transparent">
                                ever again
                            </span>
                        </motion.h1>
                        
                        <motion.p
                            className="text-base sm:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Take control with Math Flow's AI-powered math assistant. Solve problems, create graphs, and study with flashcards.
                        </motion.p>

                        <motion.div
                            className="w-full max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <SignedIn>
                                <PromptInput onSubmit={handleSubmit}>
                                    <PromptInputTextarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything about math..."
                                    />
                                    <PromptInputToolbar>
                                        <PromptInputTools>
                                            <PromptInputButton
                                                variant="outline"
                                                onMouseEnter={handleStepsHover}
                                                onMouseLeave={handleStepsLeave}
                                                className="opacity-50"
                                            >
                                                <ClockIcon ref={clockRef} className="w-4 h-4" />
                                                <span>Steps</span>
                                            </PromptInputButton>
                                            <PromptInputButton
                                                variant="outline"
                                                onMouseEnter={handleGraphHover}
                                                onMouseLeave={handleGraphLeave}
                                                className="opacity-50"
                                            >
                                                <ChartSplineIcon ref={chartRef} className="w-4 h-4" />
                                                <span>Graph</span>
                                            </PromptInputButton>
                                        </PromptInputTools>
                                        <PromptInputSubmit
                                            disabled={!input.trim()}
                                            className="bg-[#00C48D] hover:bg-[#00C48D]/80"
                                        />
                                    </PromptInputToolbar>
                                </PromptInput>
                            </SignedIn>

                            <SignedOut>
                                <PromptInput onSubmit={(e) => e.preventDefault()}>
                                    <PromptInputTextarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Sign in to start solving problems..."
                                        disabled
                                    />
                                    <PromptInputToolbar>
                                        <PromptInputTools>
                                            <PromptInputButton
                                                variant="outline"
                                                disabled
                                                className="opacity-50"
                                            >
                                                <ClockIcon ref={clockRef} className="w-4 h-4" />
                                                <span>Steps</span>
                                            </PromptInputButton>
                                            <PromptInputButton
                                                variant="outline"
                                                disabled
                                                className="opacity-50"
                                            >
                                                <ChartSplineIcon ref={chartRef} className="w-4 h-4" />
                                                <span>Graph</span>
                                            </PromptInputButton>
                                        </PromptInputTools>
                                        <SignInButton mode="modal">
                                            <button className="px-4 py-2 bg-[#00C48D] hover:bg-[#00C48D]/80 text-white text-sm font-medium rounded-md transition-colors">
                                                Sign In to Continue
                                            </button>
                                        </SignInButton>
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