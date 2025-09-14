// src/components/cart/CartLineItem.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/market-utils';
import { Minus, Plus } from 'lucide-react';

export default function CartLineItem({ line }) {
  const locale = useLocale();
  const { removeFromCart, updateQuantity } = useCart();
  const { merchandise, quantity } = line;

  return (
    <li className="flex py-4">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border auvra-border">
        <Image
          src={merchandise.image.url}
          alt={merchandise.image.altText}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium">
            <h3>
              <Link href={`/${locale}/product/${merchandise.product.handle}`}>
                {merchandise.product.title}
              </Link>
            </h3>
            <p className="ml-4">{formatMoney(merchandise.price.amount, merchandise.price.currencyCode)}</p>
          </div>
          <p className="mt-1 text-sm text-foreground/80">{merchandise.title}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border auvra-border rounded-md">
            <button onClick={() => updateQuantity(line.id, quantity - 1)} className="p-2 disabled:opacity-50" disabled={quantity <= 1}>
              <Minus size={14} />
            </button>
            <span className="px-2 text-center">{quantity}</span>
            <button onClick={() => updateQuantity(line.id, quantity + 1)} className="p-2">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex">
            <button
              type="button"
              className="font-medium text-primary hover:text-primary/80"
              onClick={() => removeFromCart(line.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}