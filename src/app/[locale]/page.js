// src/app/[locale]/page.js
import { getCollections } from '@/lib/shopify';
import HomepageClient from './HomepageClient';

export default async function Home({ params }) {
  const { locale } = await params;

  // Fetch the first 4 collections to display on the homepage
  const allCollections = await getCollections(locale);
  const collections = allCollections.slice(0, 4);

  return <HomepageClient collections={collections} />;
}