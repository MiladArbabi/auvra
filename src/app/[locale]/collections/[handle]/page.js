import Link from 'next/link';
import {sf} from '@/lib/shopify';
import Filters from '@/components/CollectionFilters';

const QUERY = /* GraphQL */ `
  query Collection(
    $handle: String!, $first: Int!, $query: String,
    $sortKey: ProductCollectionSortKeys, $reverse: Boolean
  ) {
    collection(handle: $handle) {
      title
      description
      handle
      products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
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
  }
`;

function buildQuery({q, min, max}) {
  const parts = [];
  if (q) parts.push(q);
  if (min) parts.push(`variants.price:>=${Number(min)}`);
  if (max) parts.push(`variants.price:<=${Number(max)}`);
  return parts.length ? parts.join(' AND ') : null;
}

function mapSort(sortParam) {
  switch (sortParam) {
    case 'price-asc':  return { sortKey: 'PRICE', reverse: false };
    case 'price-desc': return { sortKey: 'PRICE', reverse: true };
    case 'created-desc': return { sortKey: 'CREATED', reverse: true };
    case 'best-selling': return { sortKey: 'BEST_SELLING', reverse: false };
    default: return { sortKey: 'RELEVANCE', reverse: false };
  }
}

export default async function CollectionPage({ params, searchParams }) {
  const { locale, handle } = await params;

  const q     = searchParams?.q || null;
  const min   = searchParams?.min || null;
  const max   = searchParams?.max || null;
  const sort  = searchParams?.sort || 'relevance';

  const query = buildQuery({ q, min, max });
  const { sortKey, reverse } = mapSort(sort);

  const data = await sf(QUERY, {
    handle,
    first: 24,
    query,
    sortKey,
    reverse
  });

  const col = data?.collection;
  const items = col?.products?.edges?.map(e => e.node) || [];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">{col?.title || 'Collection'}</h1>
      {col?.description && <p className="text-neutral-600 mt-1">{col.description}</p>}

      <Filters />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </main>
  );
}
