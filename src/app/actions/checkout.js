// src/app/actions/checkout.js
'use server';

import {redirect} from 'next/navigation';
import {sf} from '@/lib/shopify';

const CREATE_CART = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export async function checkout(formData) {
  const variantId = formData.get('variantId');
  const quantity = Number(formData.get('quantity') || 1);

  if (!variantId) {
    throw new Error('Missing variantId');
  }

  const data = await sf(CREATE_CART, {
    lines: [{ merchandiseId: variantId, quantity }]
  });

  const errs = data?.cartCreate?.userErrors;
  if (errs?.length) {
    throw new Error(errs.map(e => `${e.field?.join('.') || 'error'}: ${e.message}`).join('; '));
  }

  const url = data?.cartCreate?.cart?.checkoutUrl;
  if (!url) throw new Error('No checkoutUrl returned');

  redirect(url);
}