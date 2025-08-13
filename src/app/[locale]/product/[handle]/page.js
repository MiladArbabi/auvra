import {sf} from '@/lib/shopify';

const QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id title handle description descriptionHtml availableForSale
      featuredImage { url altText }
      seo { title description }
      variants(first: 1) { edges { node { id availableForSale price { amount currencyCode } } } }
    }
  }
`;

export default async function ProductPage({params: {locale, handle}}) {
  const data = await sf(QUERY, {handle});
  const p = data?.product;
  if (!p) return <div className="p-8">Not found.</div>;

  const firstVar = p.variants?.edges?.[0]?.node;
  const price = firstVar?.price?.amount;
  const currency = firstVar?.price?.currencyCode || 'EUR';
  const inStock = (firstVar?.availableForSale ?? p.availableForSale) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const url = `https://auvra.shop/${locale}/product/${p.handle}`;

  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.title,
    image: p.featuredImage?.url ? [p.featuredImage.url] : undefined,
    description: p.seo?.description || p.description,
    sku: p.id?.split('/')?.pop(),
    offers: { '@type': 'Offer', url, priceCurrency: currency, price: price ?? undefined, availability: inStock }
  };

  return (
    <main className="min-h-screen p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />
      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
        <div>
          {p.featuredImage?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} className="w-full rounded-xl" />
          ) : <div className="aspect-square bg-gray-100 rounded-xl" />}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          {price && <p className="mt-2 text-lg">{price} {currency}</p>}
          <div className="prose mt-4" dangerouslySetInnerHTML={{__html: p.descriptionHtml || ''}} />
          <div className="mt-6">
            <button className="px-4 py-2 rounded-xl bg-black text-white" disabled>Checkout (coming soon)</button>
          </div>
        </div>
      </div>
    </main>
  );
}
