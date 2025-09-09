// src/components/layout/Header.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import NavDropdown from './NavDropdown';

export default function Header({ collections }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  return (
    // Updated: Using brand colors
    <header className="sticky top-0 z-20 bg-subtle">
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
        <nav className="hidden lg:flex gap-8 text-sm font-semibold uppercase tracking-wider text-foreground/80">
          {/* We will make these into mega menus next */}
          <NavDropdown title="Shop by Category" items={collections} />
          <Link href="#" className="hover:text-primary">
            Shop by Concern
          </Link>
          <Link href="#" className="hover:text-primary">
            Best Sellers
          </Link>
          </nav>
          <div className="flex items-center gap-4">
          {/* Placeholder for Search Icon */}
          <button aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          {/* Placeholder for Account Icon */}
          <Link href="#" aria-label="My account">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>
          {/* Placeholder for Cart Icon */}
          <Link href="#" aria-label="Shopping cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
          </Link>
          </div>
        </div>
      </header>
    );
  }