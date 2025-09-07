'use client';

import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Resources', href: '/resources' },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`-translate-x-1/2 fixed top-0 left-1/2 z-100 mt-2 w-11/12 self-center rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-xl transition-all duration-500 sm:w-2/3 ${
        isScrolled ? 'w-2/4' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            className="group flex flex-row items-center justify-center gap-2"
            href="/"
          >
            <div className="relative">
              <Image alt="Math Flow" height={24} src="/fx.svg" width={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black text-lg leading-none">
                Math Flow
              </span>
            </div>
          </Link>

          <div className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <Link
                className="font-medium text-neutral-600 text-sm transition-colors hover:text-black"
                href={item.href}
                key={item.name}
              >
                {item.name}
              </Link>
            ))}

            {/* <div className="relative group">
              <div className="flex items-center gap-1 font-medium text-neutral-600 text-sm bg-transparent hover:bg-transparent transition-colors hover:text-black p-0 mx-0 h-auto cursor-pointer focus:outline-none">
                Use Cases
                <ChevronDown className="h-3 w-3" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-[560px] bg-white border border-border/30 rounded-md p-2 mt-2">
                  <div className="grid grid-cols-2 gap-1">
                    {useCases.map((useCase) => (
                      <Link key={useCase.name} href={useCase.href} className="flex flex-col items-start p-3 hover:bg-neutral-100 cursor-pointer rounded">
                        <div className="flex items-center gap-2">
                          <useCase.icon className="h-4 w-4 text-neutral-600" />
                          <div className="font-medium text-black">{useCase.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-6">{useCase.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="flex items-center">
            <Link className="flex items-center space-x-5" href="/chat">
              <Button className="group bg-black text-white hover:bg-black/90">
                Start learning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="flex items-center space-x-2 lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-9 w-9" size="icon" variant="ghost">
                    <Menu className="h-5 w-5 text-black focus:ring-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[200px] border-border/30 bg-white"
                >
                  {navItems.map((item) => (
                    <DropdownMenuItem asChild key={item.name}>
                      <Link className="font-medium text-black" href={item.href}>
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="font-medium text-black">
                    <div className="flex w-full items-center justify-between">
                      Use Cases
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </DropdownMenuItem>
                  {/* {useCases.map((useCase) => (
                    <DropdownMenuItem asChild key={useCase.name}>
                      <Link className="font-medium text-black pl-6" href={useCase.href}>
                        {useCase.name}
                      </Link>
                    </DropdownMenuItem>
                  ))} */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
