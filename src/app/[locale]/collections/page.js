// src/app/[locale]/collections/page.js
import Link from 'next/link';
import Image from 'next/image';
import {sf} from '@/lib/shopify';

const QUERY = /* GraphQL */ `
  query($first:Int!) {
    collections(first:$first) {
      edges {
        node {
          handle
          title
          image { url altText width height }
        }
      }
    }
  }
`;

export default async function Collections({ params }) {
  const { locale } = await params;
  const data = await sf(QUERY, { first: 24 });
  const items = data?.collections?.edges?.map(e => e.node) || [];
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Collections</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(col => (
          <Link key={col.handle} href={`/${locale}/collections/${col.handle}`} className="block border rounded-xl p-4 hover:shadow-sm">
            {col.image?.url && (
              <Image
                src={col.image.url}
                alt={col.image.altText || col.title}
                width={col.image.width || 800}
                height={col.image.height || 800}
                className="rounded-lg mb-3"
                sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
              />
            )}
            <h3 className="font-medium">{col.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
