// src/lib/shopify.js
import { localeToLanguage } from './market-utils';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2025-07';
const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

const PRIVATE = (process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || '').trim();
const PUBLIC  = (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim();

const preferPublicInDev = process.env.NODE_ENV !== 'production';

function buildHeaders() {
  // Prefer PUBLIC in dev to avoid accidental Admin shpat_ usage
  if (preferPublicInDev && PUBLIC) {
    if (process.env.NODE_ENV !== 'production') console.log('[shopify] using PUBLIC storefront token');
    return {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': PUBLIC,
    };
  }
  if (PRIVATE) {
    if (process.env.NODE_ENV !== 'production') console.log('[shopify] using PRIVATE storefront token');
    return {
      'Content-Type': 'application/json',
      'Shopify-Storefront-Private-Token': PRIVATE,
    };
  }
  if (PUBLIC) {
    if (process.env.NODE_ENV !== 'production') console.log('[shopify] using PUBLIC storefront token');
    return {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': PUBLIC,
    };
  }
  throw new Error('[storefront] missing token env (set SHOPIFY_STOREFRONT_PRIVATE_TOKEN or SHOPIFY_STOREFRONT_ACCESS_TOKEN)');
}

export async function sf(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch {
    throw new Error(`[storefront] Non-JSON response (${res.status}): ${text.slice(0,180)}…`);
  }

  if (!res.ok || json.errors) {
    const msg = json.errors?.map(e => e.message).join('; ') || `${res.status} ${res.statusText}`;
    throw new Error(`[storefront] ${msg}`);
  }
  return json.data;
}

const collectionsQuery = /* GraphQL */ `
  query Collections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export async function getCollections(locale) {
  const language = localeToLanguage(locale);
  const data = await sf(collectionsQuery, { language });
  return data?.collections?.edges?.map(e => e.node) || [];
}