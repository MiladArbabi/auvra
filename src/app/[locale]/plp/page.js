// src/app/[locale]/plp/page.js
import Link from 'next/link';
import Image from 'next/image';
import {sf} from '@/lib/shopify';
import {getCountry, localeToLanguage, localeTag, formatMoney} from '@/lib/market';
import CountrySwitcher from '@/components/CountrySwitcher';

const QUERY = /* GraphQL */ `
  query($first:Int!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first:$first) {
      edges {
        node {
          handle
          title
          featuredImage { url altText width height }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }
`;

export default async function PLP({ params }) {
  const { locale } = await params;
  const country = await getCountry('SE');
  const language = localeToLanguage(locale);
  const tag      = localeTag(locale, country);

  const data = await sf(QUERY, { first: 24, country, language });
  const items = data?.products?.edges?.map(e => e.node) || [];
  return (
    <main className="p-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div className="mb-4"><CountrySwitcher current={country} />
      {items.map(p => {
        const amt = p.priceRange?.minVariantPrice?.amount;
        const ccy = p.priceRange?.minVariantPrice?.currencyCode || 'EUR';
        const price = amt ? formatMoney(amt, ccy, tag) : null;
        return (
          <Link key={p.handle} href={`/${locale}/product/${p.handle}`} className="block border rounded-xl p-4 hover:shadow-sm">
            {p.featuredImage?.url && (
              <Image
                src={p.featuredImage.url}
                alt={p.featuredImage.altText || p.title}
                width={p.featuredImage.width || 800}
                height={p.featuredImage.height || 800}
                className="rounded-lg mb-3"
                sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
              />
            )}
            <h3 className="font-medium">{p.title}</h3>
            {price && <p className="text-sm mt-1">{price}</p>}
          </Link>
        );
      })}
      </div>
    </main>
  );
}
