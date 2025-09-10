// src/components/layout/Header.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import NavDropdown from './NavDropdown';
import MobileMenu from './MobileMenu';
import { Search, User, ShoppingBag } from 'lucide-react';

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
        <nav className="hidden lg:flex gap-8 text-sm font-normal uppercase tracking-wider text-foreground/80"></nav>
          {/* We will make these into mega menus next */}
          <NavDropdown title="Shop by Category" items={collections} />
          <Link href="#" className="hover:text-primary">
            Shop by Concern
          </Link>
          <Link href="#" className="hover:text-primary">
            Best Sellers
          </Link>
          </nav>
          {/* Desktop Utility Icons */}
        <div className="hidden lg:flex items-center gap-5">
          <button aria-label="Search" className="hover:text-primary transition-colors">
            <Search size={22} />
          </button>
          {/* Placeholder for Account Icon */}
          <Link href="#" aria-label="My account" className="hover:text-primary transition-colors">
            <User size={22} />
          </Link>
          <Link href="#" aria-label="Shopping cart" className="hover:text-primary transition-colors">
            <ShoppingBag size={22} />
          </Link>
          </div>
          {/* Mobile Menu Component */}
         <MobileMenu collections={collections} />
        </div>
      </header>
    );
  }