// src/components/product/ProductInfo.js
import { formatMoney, localeTag, currencyForCountry } from '@/lib/market';
import CountrySwitcher from '@/components/CountrySwitcher';
import VatNote from '@/components/VatNote';
import PartnerCTA from '@/components/PartnerCTA';
import AddToCart from './AddToCart';

export default function ProductInfo({ product, country, locale }) {
  const tag = localeTag(locale, country);

  // Extract product details
  const { title, descriptionHtml, externalUrl, variants } = product;
  const ext = externalUrl?.value || null;
  const firstVar = variants?.edges?.[0]?.node;
  const amount = firstVar?.price?.amount;
  const currency = firstVar?.price?.currencyCode || currencyForCountry(country);
  const priceFmt = !ext && amount ? formatMoney(amount, currency, tag) : null;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="mt-3">
        <CountrySwitcher current={country} />
      </div>

      {priceFmt && (
        <div className="mt-4">
          <p className="text-2xl tracking-tight">{priceFmt}</p>
          <VatNote country={country} tag={tag} />
        </div>
      )}

      {/* Use a Tailwind typography plugin class for rendered HTML */}
      <div
        className="prose prose-lg mt-6 text-foreground/80"
        dangerouslySetInnerHTML={{ __html: descriptionHtml || '' }}
      />

      {ext ? (
        <div className="mt-6">
          <PartnerCTA href={ext} locale={locale} country={country} {...product} />
        </div>
      ) : (
        <AddToCart variantId={firstVar?.id} currency={currency} amount={amount} />
      )}
    </div>
  );
}