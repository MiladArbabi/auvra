// src/components/product/AddToCart.js
'use client';

import Button from '@/components/ui/Button';
import BeginCheckout from '@/components/BeginCheckout';

export default function AddToCart({ variantId, currency, amount }) {
  return (
    <>
      <form id="buy" className="mt-6 flex items-center gap-4">
        <input type="hidden" name="variantId" value={variantId || ''} />
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
          disabled={!variantId}
        >
          Add to Cart
        </Button>
      </form>
      <BeginCheckout
        formId="buy"
        currency={currency}
        value={amount ? Number(amount) : undefined}
      />
    </>
  );
}