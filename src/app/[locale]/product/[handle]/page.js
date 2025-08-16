import Image from 'next/image';
import {sf} from '@/lib/shopify';
import {checkout} from '@/app/actions/checkout';
import {getCountry, localeToLanguage, localeTag, formatMoney} from '@/lib/market';
import VatNote from '@/components/VatNote';
import CountrySwitcher from '@/components/CountrySwitcher';

const QUERY = /* GraphQL */ `
  query ProductByHandle(
    $handle: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id title handle description descriptionHtml availableForSale
      featuredImage { url altText width height }
      seo { title description }
      variants(first: 1) { edges { node {
        id availableForSale price { amount currencyCode }
      }}}
    }
  }
`;

export default async function ProductPage({params}) {
  const { locale, handle } = await params;

  const country  = getCountry('SE');
  const language = localeToLanguage(locale);
  const tag      = localeTag(locale, country);

  const data = await sf(QUERY, {handle, country, language});
  const p = data?.product;
  if (!p) return <div className="p-8">Not found.</div>;

  const firstVar = p.variants?.edges?.[0]?.node;
  const amount   = firstVar?.price?.amount;
  const currency = firstVar?.price?.currencyCode || 'EUR';
  const priceFmt = amount ? formatMoney(amount, currency, tag) : null;

  const inStock = (firstVar?.availableForSale ?? p.availableForSale)
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
  const url = `https://auvra.shop/${locale}/product/${p.handle}`;

  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.title,
    image: p.featuredImage?.url ? [p.featuredImage.url] : undefined,
    description: p.seo?.description || p.description,
    sku: p.id?.split('/')?.pop(),
    offers: { '@type': 'Offer', url, priceCurrency: currency, price: amount ?? undefined, availability: inStock }
  };

  return (
    <main className="min-h-screen p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />
      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
        <div>
          {p.featuredImage?.url ? (
            <Image
              src={p.featuredImage.url}
              alt={p.featuredImage.altText || p.title}
              width={p.featuredImage.width || 800}
              height={p.featuredImage.height || 800}
              className="w-full rounded-xl"
            />
          ) : <div className="aspect-square bg-gray-100 rounded-xl" />}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          <div className="mt-2"><CountrySwitcher current={country} /></div>
          {priceFmt && (
            <>
              <p className="mt-2 text-lg">{priceFmt}</p>
              <VatNote country={country} />
            </>
          )}
          <div className="prose mt-4" dangerouslySetInnerHTML={{__html: p.descriptionHtml || ''}} />
          <form action={checkout} className="mt-6 space-x-3">
            <input type="hidden" name="variantId" value={firstVar?.id || ''} />
            <input
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              className="border rounded-xl px-3 py-2 w-24"
              aria-label="Quantity"
            />
            <button
              className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
              disabled={!firstVar?.id}
            >
              Checkout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
