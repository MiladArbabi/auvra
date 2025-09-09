// src/app/[locale]/page.js
'use client';

import { useLocale } from 'next-intl';
import InfoCard from '@/components/cards/InfoCard';

export default function Home() {
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

  return (
    <main className="min-h-screen">
      {/* The Hero card is now full-width, outside of any container */}
      <InfoCard {...heroCard} size="hero" borderRadius="rounded-none" />
      
    </main>
  );
}
