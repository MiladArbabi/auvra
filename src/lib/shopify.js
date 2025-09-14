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

const bestSellersQuery = /* GraphQL */ `
  query BestSellers($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING) {
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

export async function getBestSellers(locale) {
  const language = localeToLanguage(locale);
  const data = await sf(bestSellersQuery, { language });
  return data?.products?.edges?.map((e) => e.node) || [];
}

const menuQuery = /* GraphQL */ `
  query Menu($handle: String!, $language: LanguageCode)
  @inContext(language: $language) {
    menu(handle: $handle) {
      items {
        title
        resource: resource {
          ... on Collection {
            handle
            image { url altText }
          }
        }
      }
    }
  }
`;

export async function getMenu(handle, locale) {
  const language = localeToLanguage(locale);
  const data = await sf(menuQuery, { handle, language });
  // Transform the data to match the structure our CategoryCard expects
  return data?.menu?.items?.map(item => ({
    title: item.title,
    handle: item.resource?.handle,
    image: item.resource?.image,
  })) || [];
}

const cartFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              product {
                title
                handle
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

const createCartMutation = /* GraphQL */ `
  mutation ($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

const addToCartMutation = /* GraphQL */ `
  mutation ($cartId: ID!, $lines: [CartLineInput!]) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

const getCartQuery = /* GraphQL */ `
  query ($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;

export async function createCart(variantId, quantity) {
  const lines = [{ merchandiseId: variantId, quantity }];
  const data = await sf(createCartMutation, { lines });
  return data?.cartCreate?.cart;
}

export async function addToCartLines(cartId, variantId, quantity) {
  const lines = [{ merchandiseId: variantId, quantity }];
  const data = await sf(addToCartMutation, { cartId, lines });
  return data?.cartLinesAdd?.cart;
}

export async function getCart(cartId) {
  const data = await sf(getCartQuery, { cartId });
  return data?.cart;
}

const removeFromCartMutation = /* GraphQL */ `
  mutation ($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

const updateCartMutation = /* GraphQL */ `
  mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

export async function removeFromCartLine(cartId, lineId) {
  const data = await sf(removeFromCartMutation, { cartId, lineIds: [lineId] });
  return data?.cartLinesRemove?.cart;
}

export async function updateCartLine(cartId, lineId, quantity) {
  const lines = [{ id: lineId, quantity }];
  const data = await sf(updateCartMutation, { cartId, lines });
  return data?.cartLinesUpdate?.cart;
}

const getCustomerQuery = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      phone
      orders(first: 10) {
        edges {
          node {
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function getCustomer(customerAccessToken) {
  const data = await sf(getCustomerQuery, { customerAccessToken });
  return data?.customer;
}