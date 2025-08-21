// src/app/[locale]/plp/page.js
import { sf } from '@/lib/shopify';
import { getCountry, localeToLanguage, localeTag, formatMoney } from '@/lib/market';
import PLPClient from './PLPClient';
import { headers } from 'next/headers';
import { getVariantFromHeaders } from '@/lib/experiments';

const QUERY = /* GraphQL */ `
  query($first:Int!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first:$first) {
      edges {
        node {
          handle
          title
          featuredImage { url altText width height }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }
`;

const PAGE_SIZE = 9;

export default async function PLP({ params, searchParams }) {
  const { locale } = await params;
  const pageNum = Math.max(1, parseInt(searchParams?.page, 10) || 1);

  const country  = await getCountry('SE');
  const language = localeToLanguage(locale);
  const tag      = localeTag(locale, country);

  const hdrs = await headers();
  const variant = getVariantFromHeaders(hdrs, 'plp_filters'); // 'A' | 'B' (kept, no visual change here)

  // For now: fetch up to 100 and slice on server for simple numeric pagination.
  // (Fine for small catalogs; switch to cursor-based later when needed.)
  const data  = await sf(QUERY, { first: 100, country, language });
  const items = data?.products?.edges?.map(e => e.node) || [];

  const total     = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Clamp page if someone types ?page=999
  const current = Math.min(pageNum, totalPages);

  const start = (current - 1) * PAGE_SIZE;
  const end   = start + PAGE_SIZE;
  const pageSlice = items.slice(start, end);

  // Pre-format money server-side
  const viewItems = pageSlice.map(p => {
    const amt = p.priceRange?.minVariantPrice?.amount;
    const ccy = p.priceRange?.minVariantPrice?.currencyCode || 'EUR';
    const price = amt ? formatMoney(amt, ccy, tag) : null;
    return {
      handle: p.handle,
      title: p.title,
      price,
      image: p.featuredImage || null,
    };
  });

  const baseHref = `/${locale}/plp`;

  return (
    <PLPClient
      locale={locale}
      country={country}
      items={viewItems}
      variant={variant}
      page={current}
      totalPages={totalPages}
      baseHref={baseHref}
    />
  );
}