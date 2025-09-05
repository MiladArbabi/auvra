// src/app/[locale]/page.js
'use client';

import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale() || 'en';

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-neutral-600">{t('subtitle')}</p>

        <div className="mt-6">{/* market switcher */}<div id="market-switch"></div></div>

        <div className="mt-6 flex gap-4">
          <Link href={`/${locale}/plp`} className="underline">All products</Link>
          <Link href={`/${locale}/collections`} className="underline">Collections</Link>
        </div>
      </div>
    </main>
  );
}
