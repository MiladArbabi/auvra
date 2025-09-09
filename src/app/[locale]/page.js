// src/app/[locale]/page.js
'use client';

import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';
import InfoCard from '@/components/cards/InfoCard';

export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale() || 'en';

  // Mock data for our new InfoCard component
  const heroCard = {
    headline: 'Mindful Beauty',
    text: 'Discover our new collection of curated essentials for a conscious lifestyle.',
    backgroundImage: {
      url: '/mock_product_pictures/Gemini_Generated_Image_4gmokf4gmokf4gmo.png',
      alt: 'Calm and serene beauty products'
    },
    cta: { href: `/${locale}/collections/all`, text: 'Shop Now' },
  };

  const categoryCard = {
    headline: 'Skincare',
    backgroundColor: 'bg-secondary',
    cta: { href: '#', text: 'Explore' },
  };

  return (
    <main className="min-h-screen">
      {/* The Hero card is now full-width, outside of any container */}
      <InfoCard {...heroCard} size="hero" borderRadius="rounded-none" />


      {/* The rest of the content is wrapped in a container to keep it centered */}
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-neutral-600">{t('subtitle')}</p>

        {/* Display the InfoCards for testing */}
        <div className="mt-12">
          <InfoCard {...categoryCard} />
        </div>

        <div className="mt-6">{/* market switcher */}<div id="market-switch"></div></div>

        <div className="mt-6 flex gap-4">
          <Link href={`/${locale}/plp`} className="underline">All products</Link>
          <Link href={`/${locale}/collections`} className="underline">Collections</Link>
        </div>
      </div>
    </main>
  );
}
