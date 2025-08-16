'use client';
import Link from 'next/link';
import {useLocale} from 'next-intl';
import ManageCookies from '@/components/ManageCookies';

export default function Footer() {
  const locale = useLocale() || 'en';
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-5xl p-6 text-sm text-neutral-600">
        <ManageCookies /> • <Link href={`/${locale}/privacy`} className="underline">Privacy</Link>
      </div>
    </footer>
  );
}
