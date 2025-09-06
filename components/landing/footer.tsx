import { Github, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterLink {
    href: string;
    icon?: LucideIcon;
    label: string;
}

interface FooterSection {
    title?: string;
    links: FooterLink[];
}

interface FooterProps {
    sections?: FooterSection[];
    className?: string;
}

function FooterBrand() {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
                <Image alt="Logo" height={50} src="/logo-name.svg" width={100} />
            </div>
            <p className="text-black/70 max-w-sm leading-relaxed">
                Math Flow is an AI-powered tool that helps you learn math faster and easier.
            </p>
            <div className="flex items-center space-x-4">
                <Link href="https://github.com/ijon007/math-flow" className="text-black/70 hover:text-black transition-colors">
                    <Github className="h-5 w-5" />
                </Link>
            </div>
            <FooterCopyright />
        </div>
    );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
    return (
        <div className="flex flex-col space-y-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    className="text-black/70 hover:text-black transition-colors text-sm flex items-center"
                    href={link.href}
                >   
                    <span>{link.label}</span>
                </Link>
            ))}
        </div>
    );
}

function FooterSection({ section }: { section: FooterSection[] }) {
    return (
        <div className="flex flex-row gap-20">
            {section.map((section, index) => (
                <div className="flex flex-col space-y-3" key={index}>
                    {section.title && (
                        <h3 className="text-black font-semibold text-sm">{section.title}</h3>
                    )}
                    <FooterLinks links={section.links} />
                </div>
            ))}
        </div>
    );
}

function FooterCopyright() {
    return (
        <div className="text-black/70 text-sm">
            © {new Date().getFullYear()} Math Flow, All Rights Reserved.
        </div>
    );
}

const resourcesLinks: FooterLink[] = [
  {
    href: '/roadmap',
    label: 'Roadmap',
  },
  {
    href: '/privacy',
    label: 'Privacy policy',
  },
  {
    href: '/terms',
    label: 'Terms of use',
  },
  {
    href: 'https://github.com/ijon007/math-flow',
    label: 'Repository',
  },
];


export function Footer({ className = '' }: FooterProps) {
    return (
        <footer className={`flex items-center justify-center p-10 border-border/40 border-t bg-white ${className}`}>
            <div className="flex flex-col md:flex-row justify-between md:w-full xl:w-1/2">
                <FooterBrand />
                
                <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-6 mt-10 md:mt-0">
                    <FooterSection 
                        section={
                            [
                                { 
                                    title: 'Resources', 
                                    links: resourcesLinks 
                                }
                            ]
                        } 
                    />
                </div>
            </div>
        </footer>
    );
}
