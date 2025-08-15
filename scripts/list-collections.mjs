import 'dotenv/config';
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token  = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const ver    = process.env.SHOPIFY_API_VERSION || '2025-07';
const endpoint = `https://${domain}/api/${ver}/graphql.json`;
const QUERY = `query($first:Int!){ collections(first:$first){ edges{ node{ handle title } } } }`;
const res = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type':'application/json', 'Shopify-Storefront-Private-Token': token },
  body: JSON.stringify({ query: QUERY, variables: { first: 20 } })
});
const j = await res.json();
if (j.errors) { console.error(j.errors); process.exit(1); }
for (const {node} of j.data.collections.edges) console.log(`${node.handle}\t${node.title}`);
