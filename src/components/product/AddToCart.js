// src/components/product/AddToCart.js
'use client';

import Button from '@/components/ui/Button';
import BeginCheckout from '@/components/BeginCheckout';
import { useCart } from '@/context/CartContext';

export default function AddToCart({ selectedVariant }) {
  const { addToCart } = useCart();

  async function handleAddToCart(e) {
    e.preventDefault();
    if (!selectedVariant) return;

    const formData = new FormData(e.currentTarget);
    const quantity = parseInt(formData.get('quantity'), 10);

    await addToCart(selectedVariant.id, quantity);
  }

  return (
    <>
      <form id="buy" onSubmit={handleAddToCart} className="mt-6 flex items-center gap-4">
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