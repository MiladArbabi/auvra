// src/app/[locale]/page.js
import { getCollections, getBestSellers, getMenu } from '@/lib/shopify';
import HomepageClient from './HomepageClient';

export default async function Home({ params }) {
  const { locale } = await params;

  // Fetch the first 4 collections to display on the homepage
  const allCollections = await getCollections(locale);
  const collections = allCollections.slice(0, 4);

  // Fetch the 4 best-selling products
  const bestSellers = await getBestSellers(locale);

  // Fetch collections from our new menu
  const concernCollections = await getMenu('homepage-concerns', locale);

  return (
    <HomepageClient
      collections={collections}
      bestSellers={bestSellers}
      concernCollections={concernCollections}
    />
  );
} 