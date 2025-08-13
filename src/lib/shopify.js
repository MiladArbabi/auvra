const domain   = process.env.SHOPIFY_STORE_DOMAIN;
const pubToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const prvToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
const apiVer   = process.env.SHOPIFY_API_VERSION || '2024-07';

if (!domain || (!prvToken && !pubToken)) {
  console.warn('[shopify] Ensure SHOPIFY_STORE_DOMAIN and a Storefront token (.env.local)');
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
      ...(prvToken
        ? { 'Shopify-Storefront-Private-Token': prvToken }
        : { 'X-Shopify-Storefront-Access-Token': pubToken })
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
