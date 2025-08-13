import { createStorefrontClient } from "@shopify/storefront-api-client";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token  = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVer = process.env.SHOPIFY_API_VERSION || "2024-07";

if (!domain || !token) {
  console.warn("[shopify] Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN");
}

export const sfClient = createStorefrontClient({
  storeDomain: `https://${domain}`,
  apiVersion: apiVer,
  publicAccessToken: token,
});

export async function sf(query, variables = {}) {
  const { data, errors } = await sfClient.request(query, { variables });
  if (errors?.length) throw new Error(errors.map(e => e.message).join("; "));
  return data;
}
