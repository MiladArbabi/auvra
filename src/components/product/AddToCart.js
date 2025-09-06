// src/components/product/AddToCart.js
'use client';

import Button from '@/components/ui/Button';
import BeginCheckout from '@/components/BeginCheckout';

export default function AddToCart({ selectedVariant }) {
  return (
    <>
      <form id="buy" className="mt-6 flex items-center gap-4">
        <input type="hidden" name="variantId" value={selectedVariant?.id || ''} />
        <input
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          className="w-24 rounded-md border border-secondary px-3 py-2"
          aria-label="Quantity"
        />
        <Button
          type="submit"
          variant="primary"
          className="flex-grow"
          disabled={!selectedVariant?.id || !selectedVariant.availableForSale}
        >
          {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </form>
      <BeginCheckout
        formId="buy"
        currency={selectedVariant?.price.currencyCode}
        value={selectedVariant?.price.amount ? Number(selectedVariant.price.amount) : undefined}
      />
    </>
  );
}