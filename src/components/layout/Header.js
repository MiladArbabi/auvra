// src/components/layout/Header.js
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-20 bg-background/80 backdrop-blur">
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
        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-700">
          {/* TODO: Replace with localized links from Issue #58 */}
          <Link href="/en/collections/all" className="hover:underline">Shop All</Link>
          <Link href="#" className="hover:underline">Best Sellers</Link>
          <Link href="#" className="hover:underline">About</Link>
        </nav>
        <div>
          {/* Placeholder for future icons like cart, search, etc. */}
        </div>
      </div>
    </header>
  );
}