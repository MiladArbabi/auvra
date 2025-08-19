// src/app/[locale]/plp/PLPClient.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CountrySwitcher from '@/components/CountrySwitcher';
import { useVariant } from '@/lib/experiments-client';
import { experimentExposure } from '@/lib/track';

export default function PLPClient({ locale, country, items }) {
  const v = useVariant('plp_filters');

  // Send exposure ONCE per tab/session
  useEffect(() => {
    const k = `exposed:EXP-PLP-FILTERS:${v}`;
    if (!sessionStorage.getItem(k)) {
      experimentExposure({ id: 'EXP-PLP-FILTERS', variant: v });
      sessionStorage.setItem(k, '1');
    }
    // Optional helpful log
    console.info('[exp] plp_filters variant =', v);
  }, [v]);

  // Make a visible diff between A and B
  const grid = v === 'B'
    ? 'p-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    : 'p-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  const card = v === 'B'
    ? 'block border rounded-xl p-4 hover:shadow-md border-neutral-200'
    : 'block border rounded-xl p-4 hover:shadow-sm';

  return (
    <main className={grid}>
      <div className="mb-4 col-span-full"><CountrySwitcher current={country} /></div>

      {items.map(p => (
        <Link key={p.handle} href={`/${locale}/product/${p.handle}`} className={card}>
          {p.image?.url && (
            <Image
              src={p.image.url}
              alt={p.image.altText || p.title}
              width={p.image.width || 800}
              height={p.image.height || 800}
              className="rounded-lg mb-3"
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
            />
          )}
          <h3 className="font-medium">{p.title}</h3>
          {p.price && <p className="text-sm mt-1">{p.price}</p>}
        </Link>
      ))}
    </main>
  );
}