'use client';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-neutral-600">{t('subtitle')}</p>
        <div className="mt-6 flex gap-4">
          <a href={`/${locale}/plp`} className="underline">All products</a>
          <a href={`/${locale}/collections`} className="underline">Collections</a>
        </div>
      </div>
    </main>
  );
}
