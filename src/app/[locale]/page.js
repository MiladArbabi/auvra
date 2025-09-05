// src/app/[locale]/page.js
'use client';

import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';
import ProductCard from '@/components/product/ProductCard';

export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale() || 'en';

  // Mock product data for testing our new component
  const mockProduct = {
    title: 'Auvra Signature Moisturizer',
    handle: 'auvra-signature-moisturizer',
    featuredImage: {
      url: '/mock_product_pictures/Gemini_Generated_Image_4gmokf4gmokf4gmo.png',
      altText: 'A bottle of Auvra moisturizer'
    },
    priceRange: {
      minVariantPrice: { amount: '45.0', currencyCode: 'USD' }
    },
    externalUrl: null, // This is an internal product
  };

  const mockAffiliateProduct = {
    title: 'Partner Brand Face Oil',
    handle: 'partner-brand-face-oil',
    featuredImage: {
      url: '/mock_product_pictures/Gemini_Generated_Image_16q78916q78916q7.png',
      altText: 'A bottle of face oil from a partner'
    },
    priceRange: {
      minVariantPrice: { amount: '62.0', currencyCode: 'USD' }
    },
    externalUrl: 'https://example.com/partner-product', // This is an affiliate product
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-neutral-600">{t('subtitle')}</p>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard product={mockProduct} locale="en" />
        <ProductCard product={mockAffiliateProduct} locale="en" />
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
