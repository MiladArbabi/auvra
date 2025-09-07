// src/components/product/ProductInfo.js
'use client';

import { useState } from 'react';
import { formatMoney, localeTag, currencyForCountry } from '@/lib/market-utils';
import CountrySwitcher from '@/components/CountrySwitcher';
import VatNote from '@/components/VatNote';
import PartnerCTA from '@/components/PartnerCTA';
import AddToCart from './AddToCart';
import VariantSelector from './VariantSelector';
import { Accordion } from '@/components/ui/Accordion';

export default function ProductInfo({ product, country, locale }) {
  const tag = localeTag(locale, country);
  const variants = product.variants.edges.map(e => e.node);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  // Extract product details
  const { title, descriptionHtml, ingredients, howToUse, externalUrl, options } = product;
  const ext = externalUrl?.value || null;
  const priceFmt = !ext && selectedVariant?.price?.amount 
    ? formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode, tag) 
    : null;

  // Build the items for the accordion, only including sections that have content
  const accordionItems = [];
  if (descriptionHtml) {
    accordionItems.push({
      title: 'Description',
      content: <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />,
    });
  }
  if (ingredients?.value) {
    accordionItems.push({ title: 'Ingredients', content: ingredients.value });
  }
  if (howToUse?.value) {
    accordionItems.push({ title: 'How to Use', content: howToUse.value });
  }

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

      {/* Stock Status Indicator */}
      {!ext && selectedVariant && (
        <div className="mt-4 flex items-center">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              selectedVariant.availableForSale ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <p className="ml-2 text-sm font-medium">
            {selectedVariant.availableForSale ? 'In Stock' : 'Out of Stock'}
          </p>
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

    {ext ? (
         <div className="mt-6">
           <PartnerCTA href={ext} locale={locale} country={country} {...product} />
         </div>
       ) : (
          <AddToCart selectedVariant={selectedVariant} />
       )}

       {/* Render the accordion with our structured content */}
        <div className="mt-8">
          <Accordion items={accordionItems} />
        </div>
     </div>
  );
}