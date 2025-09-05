// src/components/layout/Header.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  return (
    // Updated: Using brand colors
    <header className="sticky top-0 z-20 border-b border-secondary/50 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between p-4">
        <Link href="/">
          <Image
            src="/auvra_logo_v01.svg"
            alt="Auvra logo"
            width={80}
            height={28}
            priority
          />
        </Link>
        {/* Updated: Using brand colors */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/80">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="hover:text-primary hover:underline"
            >
              {t(item.t_key)}
            </Link>
          ))}
        </nav>
        <div>
          {/* Placeholder for future icons like cart, search, etc. */}
        </div>
      </div>
    </header>
  );
}