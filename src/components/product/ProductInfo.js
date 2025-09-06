// src/components/product/ProductInfo.js
'use client';

import { useState } from 'react';
import { formatMoney, localeTag, currencyForCountry } from '@/lib/market-utils';
import CountrySwitcher from '@/components/CountrySwitcher';
import VatNote from '@/components/VatNote';
import PartnerCTA from '@/components/PartnerCTA';
import AddToCart from './AddToCart';
import VariantSelector from './VariantSelector';

export default function ProductInfo({ product, country, locale }) {
  const tag = localeTag(locale, country);
  const variants = product.variants.edges.map(e => e.node);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  // Extract product details
  const { title, descriptionHtml, externalUrl, options } = product;
  const ext = externalUrl?.value || null;
  const priceFmt = !ext && selectedVariant?.price?.amount 
    ? formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode, tag) 
    : null;

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

      {/* Render the Variant Selector if the product is not external */}
      {!ext && (
        <VariantSelector
          options={options}
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
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
          <AddToCart selectedVariant={selectedVariant} />
       )}
     </div>
  );
}