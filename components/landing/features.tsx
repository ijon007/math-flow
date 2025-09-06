"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Brain, Bot, Github } from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-black/10 mb-6 sm:mb-8">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span className="text-black/60 text-xs sm:text-sm">Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-black mb-4 sm:mb-6 tracking-tight font-lora px-4">
            Intelligent by design
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-black/40 max-w-2xl mx-auto leading-relaxed px-4">
            Study, solve and become better at math with AI
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24 lg:space-y-32">
          <FeatureCard 
            number="01"
            title="AI Math Agent"
            description="Your personal AI assistant that understands your math problems and helps you solve them."
            visual={<AIAgentVisual />}
            reverse={false}
          />
          
          <FeatureCard 
            number="02"
            title="Flashcards"
            description="Complete math functionality with flashcards, graphs, and step-by-step solutions."
            visual={<CalendarVisual />}
            reverse={true}
          />
          
          <FeatureCard 
            number="03"
            title="Graphs"
            description="AI-powered graphs that helps you visualize your math problems."
            visual={<SmartSchedulingVisual />}
            reverse={false}
          />
          
          <FeatureCard 
            number="04"
            title="Step-by-step solutions"
            description="AI-powered step-by-step solutions that helps you solve your math problems."
            visual={<OpenSourceVisual />}
            reverse={true}
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  number: string
  title: string
  description: string
  visual: React.ReactNode
  reverse?: boolean
}

function FeatureCard({ number, title, description, visual, reverse = false }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`space-y-6 sm:space-y-8 px-4 sm:px-0 ${reverse ? 'lg:col-start-2' : ''}`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-black/20">{number}</span>
          <div className="h-px bg-black/10 flex-1" />
        </div>
        
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 sm:mb-6 leading-tight font-lora">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-black/60 leading-relaxed mb-6 sm:mb-8 max-w-lg">
            {description}
          </p>
          
          <Link href="/calendar" className="group inline-flex items-center gap-3 sm:gap-4 text-black hover:text-black transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer">
            <span className="text-sm font-medium tracking-wide">Explore feature</span>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isHovered 
                ? 'border-black bg-black shadow-lg shadow-black/20 scale-105' 
                : 'border-black/30 bg-black/5 hover:border-black/50 hover:bg-black/10'
            }`}>
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isHovered ? 'translate-x-1 text-white' : 'text-black'
              }`} />
            </div>
          </Link>
        </div>
      </div>
      
      <div className={`order-first lg:order-none ${reverse ? 'lg:col-start-1' : ''}`}>
        <div className="relative px-4 sm:px-0">
          {visual}
        </div>
      </div>
    </div>
  )
}



function AIAgentVisual() {
  const [messageIndex, setMessageIndex] = useState(0)
  
  const messages = [
    "Analyzing your schedule...",
    "Found 3 optimal time slots",
    "Best match: 2:00 PM today"
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl sm:rounded-3xl border border-black/10" />
      
      <div className="relative h-full p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 border border-black/20 flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <div className="flex-1">
              <div className="h-1.5 sm:h-2 bg-black/10 rounded-full mb-2" />
              <div className="h-1.5 sm:h-2 bg-black/5 rounded-full w-3/4" />
            </div>
          </div>
          
          <div className="bg-black/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-black/10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="text-black/80 text-xs sm:text-sm transition-all duration-500 ease-in-out">{messages[messageIndex]}</span>
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1 h-1 bg-black/40 rounded-full" />
                  <div className={`h-0.5 sm:h-1 bg-black/10 rounded-full ${
                    i === 1 ? 'w-full' : i === 2 ? 'w-3/4' : 'w-1/2'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarVisual() {
  return (
    <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl sm:rounded-3xl border border-black/10" />
      
      <div className="relative h-full p-6 sm:p-8 lg:p-12">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="h-6 sm:h-8 flex items-center justify-center">
              <span className="text-black/40 text-xs font-medium">{day}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const hasEvent = [6, 12, 18, 23].includes(i)
            const isToday = i === 15
            
            return (
              <div
                key={i}
                className={`aspect-square rounded-md sm:rounded-lg flex items-center justify-center text-xs transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer ${
                  isToday
                    ? 'bg-black text-white font-medium shadow-lg shadow-black/20 scale-105'
                    : hasEvent
                    ? 'bg-black/10 text-black/80 border border-black/20 hover:bg-black/15 hover:scale-105'
                    : 'text-black/40 hover:bg-black/5 hover:text-black/60 hover:scale-105'
                }`}
              >
                {i + 1}
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-black/20" />
            <span className="text-black/60 text-xs sm:text-sm">Team Meeting</span>
            <span className="text-black/40 text-xs ml-auto">2:00 PM</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-black/10" />
            <span className="text-black/60 text-xs sm:text-sm">Design Review</span>
            <span className="text-black/40 text-xs ml-auto">4:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SmartSchedulingVisual() {
  const [activeSlot, setActiveSlot] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlot((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  
  const timeSlots = [
    { time: "9:00 AM", conflict: true },
    { time: "2:00 PM", optimal: true },
    { time: "4:00 PM", available: true }
  ]
  
  return (
    <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl sm:rounded-3xl border border-black/10" />
      
      <div className="relative h-full p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border border-black/20 flex items-center justify-center mb-3 sm:mb-4">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-black/80" />
          </div>
          <h4 className="text-black/80 text-base sm:text-lg font-medium">Finding optimal time</h4>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {timeSlots.map((slot, i) => (
            <div
              key={i}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer ${
                i === activeSlot
                  ? slot.optimal
                    ? 'border-black/40 bg-black/10 shadow-lg shadow-black/5 scale-105'
                    : 'border-black/20 bg-black/5 scale-102'
                  : 'border-black/10 bg-transparent hover:border-black/20 hover:bg-black/5 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-black/80 font-medium text-sm sm:text-base">{slot.time}</span>
                <div className="flex items-center gap-2">
                  {slot.conflict && (
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                  )}
                  {slot.optimal && i === activeSlot && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                  {slot.available && !slot.optimal && (
                    <div className="w-2 h-2 bg-black/40 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4 sm:mt-6">
          <div className="inline-flex items-center gap-2 text-black/60 text-xs sm:text-sm">
            <div className="w-1 h-1 bg-black/60 rounded-full animate-pulse" />
            AI analyzing preferences
          </div>
        </div>
      </div>
    </div>
  )
}

function OpenSourceVisual() {
  const [codeLineIndex, setCodeLineIndex] = useState(0)
  
  const codeLines = [
    "git clone github.com/caly/caly",
    "pnpm dev",
    "// Free to customize",
    "// MIT Licensed"
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCodeLineIndex((prev) => (prev + 1) % codeLines.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-3xl border border-black/10" />
      
      <div className="relative h-full p-12 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-black/10 border border-black/20 flex items-center justify-center mb-4">
            <Github className="w-8 h-8 text-black/80" />
          </div>
          <h4 className="text-black/80 text-lg font-medium">Open Source</h4>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/40 border border-black/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-black/40 text-xs ml-2">terminal</span>
            </div>
            <div className="font-mono text-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">$</span>
                <span className="text-black/80 transition-all duration-500 ease-in-out">
                  {codeLines[codeLineIndex]}
                </span>
                <div className="w-2 h-4 bg-black/60 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-black/60">MIT License</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-black/60">Self-hostable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-black/60">Customizable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-black/60">Free forever</span>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/github" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 bg-black/5 hover:bg-black/10 hover:border-black/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer">
              <span className="text-black/80 text-sm">View on GitHub</span>
              <ArrowRight className="w-3 h-3 text-black/60 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}