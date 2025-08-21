// src/app/[locale]/plp/PLPClient.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CountrySwitcher from '@/components/CountrySwitcher';
import { useVariant } from '@/lib/experiments-client';
import { experimentExposure } from '@/lib/track';

export default function PLPClient({ locale, country, items, variant }) {
  const cookieV = useVariant('plp_filters');
  const v = variant ?? cookieV;

  useEffect(() => {
    const k = `exposed:EXP-PLP-FILTERS:${v}`;
    if (!sessionStorage.getItem(k)) {
      experimentExposure({ id: 'EXP-PLP-FILTERS', variant: v });
      sessionStorage.setItem(k, '1');
    }
    console.info('[exp] plp_filters variant =', v);
  }, [v]);

  // Clean 1/2/3-col grid
  const grid =
    'mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start';

  const card =
    'group block no-underline border border-neutral-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition';

  return (
    <main className={grid}>
      <div className="mb-2 col-span-full">
        <CountrySwitcher current={country} />
      </div>

      {items.map((p) => (
        <Link
          key={p.handle}
          href={`/${locale}/product/${p.handle}`}
          className={card}
        >
          {/* Square image WITHOUT relying on tailwind aspect-square */}
          <div
            className="relative w-full overflow-hidden bg-neutral-100"
            style={{ paddingTop: '100%' }} // makes this box square
          >
            {p.image?.url && (
              <Image
                src={p.image.url}
                alt={p.image.altText || p.title}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                priority={false}
              />
            )}
          </div>

          <div className="p-4">
            <h3 className="text-sm font-medium text-neutral-900 truncate">
              {p.title}
            </h3>
            {p.price && (
              <p className="text-sm text-neutral-600 mt-1">{p.price}</p>
            )}
          </div>
        </Link>
      ))}
    </main>
  );
}
