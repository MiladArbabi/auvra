// src/components/layout/MobileMenu.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { User, ShoppingBag, X, ChevronDown } from 'lucide-react';

// A simple, self-contained accordion for the mobile menu
function MobileAccordion({ title, items, locale, closeMenu }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b auvra-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-lg font-semibold"
      >
        <span>{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 py-4 pl-4">
            {items.map((item) => (
              <Link
                key={item.handle}
                href={`/${locale}/collections/${item.handle}`}
                className="text-foreground/80 hover:text-primary"
                onClick={closeMenu}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function MobileMenu({ collections }) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger Icon Button */}
      <button onClick={() => setIsOpen(true)} aria-label="Open menu" className="hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end p-4 border-b auvra-border">
            <button onClick={closeMenu} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          
          {/* Main Navigation Links */}
          <nav className="flex-grow p-4">
            <MobileAccordion title="Shop by Category" items={collections} locale={locale} closeMenu={closeMenu} />
            <Link href="#" className="flex w-full items-center justify-between border-b auvra-border py-4 text-lg font-semibold" onClick={closeMenu}>
              Shop by Concern
            </Link>
            <Link href="#" className="flex w-full items-center justify-between border-b auvra-border py-4 text-lg font-semibold" onClick={closeMenu}>
              Best Sellers
            </Link>
          </nav>
          
          {/* Utility / Account Links */}
          <div className="border-t auvra-border p-4 flex items-center justify-around">
            <Link href="#" aria-label="My account" className="hover:text-primary transition-colors p-2" onClick={closeMenu}>
              <User size={22} />
            </Link>
            <Link href="#" aria-label="Shopping cart" className="hover:text-primary transition-colors p-2" onClick={closeMenu}>
              <ShoppingBag size={22} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}