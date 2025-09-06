// src/app/[locale]/collections/[handle]/page.js
import Link from 'next/link';
import Image from 'next/image';
import {sf} from '@/lib/shopify';
import Filters from '@/components/CollectionFilters';
import { getCountry } from '@/lib/market';
import { localeToLanguage, localeTag, formatMoney } from '@/lib/market-utils';
import CountrySwitcher from '@/components/CountrySwitcher';
import ProductCard from '@/components/product/ProductCard';

const QUERY = /* GraphQL */ `
  query CollectionWithProducts(
    $handle: String!, $first: Int!, $query: String,
    $sortKey: ProductSortKeys, $reverse: Boolean,
    $country: CountryCode, $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      description
      handle
    }
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          handle
          title
          featuredImage { url altText width height }
          priceRange { minVariantPrice { amount currencyCode } }
          externalUrl: metafield(namespace: "custom", key: "external_url") { value }
        }
      }
    }
  }
`;

function buildQuery({handle, q, min, max}) {
  const parts = [];
  if (handle) parts.push(`collection_handle:${handle}`);
  if (q) parts.push(q);
  if (min) parts.push(`variants.price:>=${Number(min)}`);
  if (max) parts.push(`variants.price:<=${Number(max)}`);
  return parts.length ? parts.join(' AND ') : null;
}

function mapSort(sortParam) {
  switch (sortParam) {
    case 'price-asc':    return { sortKey: 'PRICE',        reverse: false };
    case 'price-desc':   return { sortKey: 'PRICE',        reverse: true  };
    case 'created-desc': return { sortKey: 'CREATED',      reverse: true  };
    case 'best-selling': return { sortKey: 'BEST_SELLING', reverse: false };
    default:             return { sortKey: 'RELEVANCE',    reverse: false };
  }
}

export default async function CollectionPage({ params, searchParams }) {
  const { locale, handle } = await params;
  const sp = await searchParams;

  const country = await getCountry('SE');
  const language = localeToLanguage(locale);
  const tag      = localeTag(locale, country);

  const q    = sp?.q    || null;
  const min  = sp?.min  || null;
  const max  = sp?.max  || null;
  const sort = sp?.sort || 'relevance';

  const query = buildQuery({ handle, q, min, max });
  const { sortKey, reverse } = mapSort(sort);

  const data = await sf(QUERY, {
    handle, first: 24, query, sortKey, reverse, country, language
  });

  const col = data?.collection;
  const items = data?.products?.edges?.map(e => e.node) || [];
  const UTM_SOURCE = process.env.NEXT_PUBLIC_UTM_SOURCE || 'auvra';
  function withUtm(u, { campaign, term }) {
    try {
      const url = new URL(u);
      if (!url.searchParams.get('utm_source')) url.searchParams.set('utm_source', UTM_SOURCE);
      if (!url.searchParams.get('utm_medium')) url.searchParams.set('utm_medium', 'affiliate');
      if (!url.searchParams.get('utm_campaign')) url.searchParams.set('utm_campaign', campaign);
      if (term && !url.searchParams.get('utm_term')) url.searchParams.set('utm_term', term);
      return url.toString();
    } catch {
      return u;
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">{col?.title || 'Collection'}</h1>
      {col?.description && <p className="text-neutral-600 mt-1">{col.description}</p>}
      <div className="mt-3"><CountrySwitcher current={country} /></div>
      <Filters />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
       {items.map(product => (
          <ProductCard key={product.handle} product={product} locale={locale} />
        ))}
      </div>
    </main>
  );
}
