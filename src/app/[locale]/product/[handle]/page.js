// src/app/[locale]/product/[handle]/page.js
import {sf} from '@/lib/shopify';
import { getCountry } from '@/lib/market';
import { localeToLanguage, localeTag, formatMoney } from '@/lib/market-utils';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';

const QUERY = /* GraphQL */ `
  query ProductByHandle(
    $handle: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id title handle description descriptionHtml availableForSale
      options {
        name
        values 
      }
      featuredImage { url altText width height }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      seo { title description }
      externalUrl: metafield(namespace: "custom", key: "external_url") { value }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export default async function ProductPage({params}) {
  const { locale, handle } = await params;

  const country = await getCountry('SE');
  const language = localeToLanguage(locale);

  const data = await sf(QUERY, {handle, country, language});
  const product = data?.product;
  if (!product) return <div className="p-8">Not found.</div>;

  const firstVar = product.variants?.edges?.[0]?.node;
  const currency = firstVar?.price?.currencyCode || currencyForCountry(country);

  const inStock = (firstVar?.availableForSale ?? product.availableForSale)
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
  const url = `https://auvra.shop/${locale}/product/${product.handle}`;

  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.featuredImage?.url ? [product.featuredImage.url] : undefined,
    description: product.seo?.description || product.description,
    sku: product.id?.split('/')?.pop(),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: firstVar?.price?.amount ?? undefined,
      availability: inStock,
    },
  };

  return (
    <main className="min-h-screen p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />
      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
        <ProductGallery 
        title={product.title} 
        featuredImage={product.featuredImage}
        images={product.images.edges.map(e => e.node)}
        />
        <ProductInfo product={product} country={country} locale={locale} />
      </div>
    </main>
  );
}