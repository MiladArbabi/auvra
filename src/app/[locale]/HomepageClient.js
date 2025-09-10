// src/app/[locale]/HomepageClient.js

// src/app/[locale]/HomepageClient.js
'use client';

import { useLocale } from 'next-intl';
import InfoCard from '@/components/cards/InfoCard';
import CategoryCard from '@/components/cards/CategoryCard';

export default function HomepageClient({ collections }) {
  const locale = useLocale() || 'en';

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

      {/* Shop by Category Section */}
      <div className="container mx-auto px-8 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Shop by Category
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {collections.map((collection) => (
            <CategoryCard key={collection.handle} collection={collection} />
          ))}
        </div>
      </div>

      {/* The new homepage sections for Best Sellers etc. will be added below here */}
    </main>
  );
}