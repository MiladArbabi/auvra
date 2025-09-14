// src/components/cart/CartLineItem.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/market-utils';

export default function CartLineItem({ line }) {
  const locale = useLocale();
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
          <p className="text-foreground/80">Qty {quantity}</p>
          <div className="flex">
            <button
              type="button"
              className="font-medium text-primary hover:text-primary/80"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}