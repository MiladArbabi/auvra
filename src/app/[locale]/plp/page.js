// src/app/[locale]/plp/page.js
import {sf} from '@/lib/shopify';
import {getCountry, localeToLanguage, localeTag, formatMoney} from '@/lib/market';
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

export default async function PLP({ params }) {
  const { locale } = await params;
  const country = await getCountry('SE');
  const language = localeToLanguage(locale);
  const tag      = localeTag(locale, country);

  const hdrs = await headers();
  const variant = getVariantFromHeaders(hdrs, 'plp_filters'); // 'A' | 'B'

  const data = await sf(QUERY, { first: 24, country, language });
  const items = data?.products?.edges?.map(e => e.node) || [];
  // Pre-format for client to avoid redoing market math in the browser
  const viewItems = items.map(p => {
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

  return <PLPClient locale={locale} country={country} items={viewItems} variant={variant} />;
}