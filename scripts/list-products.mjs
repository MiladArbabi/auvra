// scripts/list-products.mjs
import 'dotenv/config';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token  = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVer = process.env.SHOPIFY_API_VERSION || '2024-07';
const endpoint = `https://${domain}/api/${apiVer}/graphql.json`;

const QUERY = `query ($first:Int!) { products(first:$first) { edges { node { handle title } } } }`;

const res = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
      ? { 'Shopify-Storefront-Private-Token': process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN }
      : { 'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN })
  },
  body: JSON.stringify({ query: QUERY, variables: { first: 10 } })
});
const json = await res.json();
if (json.errors) {
  console.error('Storefront errors:', json.errors);
  process.exit(1);
}
for (const {node} of json.data.products.edges) {
  console.log(`${node.handle}\t${node.title}`);
}
