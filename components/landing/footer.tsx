import { Github, type LucideIcon } from 'lucide-react';
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
        <Image alt="Logo" height={30} src="/logo.svg" width={30} />
        <span className="font-bold text-black text-lg leading-none">
          Math Flow
        </span>
      </div>
      <p className="max-w-sm text-black/70 leading-relaxed">
        Math Flow is an AI-powered tool that helps you learn math faster and
        easier.
      </p>
      <FooterCopyright />
    </div>
  );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <div className="flex flex-col space-y-2">
      {links.map((link, index) => (
        <Link
          className="flex items-center text-black/70 text-sm transition-colors hover:text-black"
          href={link.href}
          key={index}
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
            <h3 className="font-semibold text-black text-sm">
              {section.title}
            </h3>
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
    href: '/privacy',
    label: 'Privacy policy',
  },
  {
    href: '/terms',
    label: 'Terms of use',
  },
  {
    href: '/resources',
    label: 'Resources',
  },
];

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`flex items-center justify-center border-border/40 border-t bg-white p-10 ${className}`}
    >
      <div className="flex flex-col justify-between md:w-full md:flex-row xl:w-1/2">
        <FooterBrand />

        <div className="mt-10 flex flex-col space-y-4 md:mt-0 md:flex-row md:justify-end md:space-x-6 md:space-y-0">
          <FooterSection
            section={[
              {
                title: 'Resources',
                links: resourcesLinks,
              },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}
