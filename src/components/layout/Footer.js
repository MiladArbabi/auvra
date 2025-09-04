// src/components/layout/Footer.js
import Link from 'next/link';
import ManageCookies from '@/components/ManageCookies';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-neutral-50">
      <div className="container mx-auto p-8 text-neutral-700">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: About */}
          <div>
            <h3 className="font-semibold mb-2">Auvra Shop</h3>
            <p className="text-sm text-neutral-600">
              Curated essentials for a mindful lifestyle.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="font-semibold mb-2">Explore</h3>
            <nav className="flex flex-col gap-1 text-sm">
              {/* TODO: Replace with localized links */}
              <Link href="/en/collections/all" className="hover:underline">Shop All</Link>
              <Link href="#" className="hover:underline">Contact</Link>
              <Link href="/en/privacy" className="hover:underline">Privacy Policy</Link>
            </nav>
          </div>

          {/* Column 3: Social/Newsletter */}
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            {/* TODO: Add social links */}
            <p className="text-sm text-neutral-600">
              [Social Media Icons Here]
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-neutral-600">
          <p>&copy; {currentYear} Auvra. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ManageCookies />
            <span>•</span>
            <Link className="underline" href="/en/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}