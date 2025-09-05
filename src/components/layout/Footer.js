// src/components/layout/Footer.js
'use client';

import Link from 'next/link';
import ManageCookies from '@/components/ManageCookies';
import { useLocale, useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
     <footer className="border-t border-secondary/50 bg-secondary/20">
      <div className="container mx-auto p-8 text-foreground">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: About */}
          <div>
            <h3 className="font-semibold mb-2">Auvra Shop</h3>
            {/* Updated: Using a slightly lighter text color */}
            <p className="text-sm text-foreground/80">
              Curated essentials for a mindful lifestyle.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="font-semibold mb-2">Explore</h3>
            <nav className="flex flex-col gap-1 text-sm text-foreground/80">
              {siteConfig.footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className="hover:text-primary hover:underline"
                >
                  {t(item.t_key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Social/Newsletter */}
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            {/* TODO: Add social links */}
            <p className="text-sm text-foreground/80">
              [Social Media Icons Here]
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-secondary/50 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-foreground/80">
          <p>&copy; {currentYear} Auvra. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ManageCookies />
            <span>•</span>
            <Link className="underline hover:text-primary" href="/en/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      </footer>
  );
}