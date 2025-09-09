// src/components/layout/NavDropdown.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function NavDropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* The visible link in the header */}
      <Link href={`/${locale}/collections/all`} className="hover:text-primary">
        {title}
      </Link>

      {/* The dropdown panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-48 rounded-md bg-background p-4 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.handle}
                href={`/${locale}/collections/${item.handle}`}
                className="block p-2 text-sm text-foreground/80 hover:bg-subtle hover:text-primary rounded-md"
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