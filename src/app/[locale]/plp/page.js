import Link from 'next/link';
import {sf} from '@/lib/shopify';

const QUERY = /* GraphQL */ `
  query($first:Int!) {
    products(first:$first) {
      edges {
        node {
          handle
          title
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }
`;

export default async function PLP({ params }) {
  const { locale } = await params;
  const data = await sf(QUERY, { first: 24 });
  const items = data?.products?.edges?.map(e => e.node) || [];
  return (
    <main className="p-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map(p => (
        <Link key={p.handle} href={`/${locale}/product/${p.handle}`} className="block border rounded-xl p-4 hover:shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.featuredImage?.url && (
            <img src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} className="rounded-lg mb-3" />
          )}
          <h3 className="font-medium">{p.title}</h3>
          <p className="text-sm mt-1">
            {p.priceRange?.minVariantPrice?.amount} {p.priceRange?.minVariantPrice?.currencyCode}
          </p>
        </Link>
      ))}
    </main>
  );
}
