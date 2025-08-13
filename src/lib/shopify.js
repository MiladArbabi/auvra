const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token  = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVer = process.env.SHOPIFY_API_VERSION || '2024-07';

if (!domain || !token) {
  console.warn('[shopify] Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN');
}

const endpoint = `https://${domain}/api/${apiVer}/graphql.json`;

/**
 * Server-side Storefront GraphQL fetch
 * @param {string} query
 * @param {object} variables
 * @returns {Promise<any>}
 */
export async function sf(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables }),
    // avoid stale responses while developing
    cache: 'no-store'
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    const msg = json.errors?.map(e => e.message).join('; ') || res.statusText;
    throw new Error(`[storefront] ${msg}`);
  }
  return json.data;
}
