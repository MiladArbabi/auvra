// src/app/[locale]/HomepageClient.js

// src/app/[locale]/HomepageClient.js
'use client';

import { useLocale } from 'next-intl';
import InfoCard from '@/components/cards/InfoCard';
import CategoryCard from '@/components/cards/CategoryCard';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';

export default function HomepageClient({ collections, bestSellers, concernCollections }) {
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

      {/* Best Sellers Section */}
      <div className="bg-subtle">
        <div className="container mx-auto px-8 py-16">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Best Sellers
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.handle} product={product} locale={locale} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href={`/${locale}/collections/all`} variant="primary">
              Shop All Products
            </Button>
          </div>
        </div>
      </div>

      {/* Shop by Concern Section */}
      <div className="container mx-auto px-8 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Shop by Concern
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {concernCollections.map((collection) => (
            <CategoryCard key={collection.handle} collection={collection} />
          ))}
        </div>
      </div>
    </main>
  );
}