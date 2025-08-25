// src/app/[locale]/plp/PLPClient.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CountrySwitcher from '@/components/CountrySwitcher';
import { useVariant } from '@/lib/experiments-client';
import { experimentExposure, affiliateClick } from '@/lib/track';

export default function PLPClient({ locale, country, items, variant, page, totalPages, baseHref }) {
  const cookieV = useVariant('plp_filters');
  const v = variant ?? cookieV;
  const partnerLabel = locale === 'sv' ? 'Se pris hos partner' : 'See price on partner site';

  // Single exposure per session
  useEffect(() => {
    const k = `exposed:EXP-PLP-FILTERS:${v}`;
    if (!sessionStorage.getItem(k)) {
      experimentExposure({ id: 'EXP-PLP-FILTERS', variant: v });
      sessionStorage.setItem(k, '1');
    }
  }, [v]);

  // Container + exact 3-cols on lg+
  const wrapper = 'mx-auto max-w-7xl px-4 py-8';;
  const grid    = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start';

  const card =
    'group block no-underline border border-neutral-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition';

  const UTM_SOURCE = process.env.NEXT_PUBLIC_UTM_SOURCE || 'auvra';
  function withUtm(u, { campaign, term }) {
    try {
      const url = new URL(u);
      // only add if not already present
      if (!url.searchParams.get('utm_source')) url.searchParams.set('utm_source', UTM_SOURCE);
      if (!url.searchParams.get('utm_medium')) url.searchParams.set('utm_medium', 'affiliate');
      if (!url.searchParams.get('utm_campaign')) url.searchParams.set('utm_campaign', campaign);
      if (term && !url.searchParams.get('utm_term')) url.searchParams.set('utm_term', term);
      return url.toString();
    } catch {
      return u;
    }
  }

  return (
    <main className={wrapper}>
      <div className="mb-4">
        <CountrySwitcher current={country} />
      </div>

      {/* 3 × 3 grid */}
      <div className={grid}>
        {items.map((p, idx) => {
          const isExternal = Boolean(p.extUrl);
          const label = isExternal ? partnerLabel : (p.price || '');
          const href = isExternal
            ? withUtm(p.extUrl, { campaign: 'plp_card', term: p.handle })
            : `/${locale}/product/${p.handle}`;

          const CardInner = (
            <>
             <div className="relative w-full pb-[100%] bg-neutral-100 overflow-hidden">
                {p.image?.url && (
                  <Image
                    src={p.image.url}
                    alt={p.image.altText || p.title}
                    fill
                    className="object-cover"
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    priority={false}
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-neutral-900 truncate">{p.title}</h3>
                {label && <p className="text-sm text-neutral-600 mt-1">{label}</p>}
              </div>
            </>
          );
          return isExternal ? (
            <a
              key={p.handle}
              href={href}
              target="_blank"
              rel="nofollow sponsored noopener"
              className={card}
              onClick={() => {
                affiliateClick({
                  location: 'plp',
                  locale,
                  country,
                  product_handle: p.handle,
                  product_title: p.title,
                  position: idx + 1,
                  partner_url: href,
                  campaign: 'plp_card',
                });
              }}
            >
              {CardInner}
            </a>
          ) : (
            <Link
              key={p.handle}
              href={href}
              className={card}
            >
              {CardInner}
            </Link>
          );
        })}
      </div>

      {/* Pager row (bottom, centered) */}
      <nav className="mt-8 flex justify-center items-center gap-2 text-sm">
        {/* Prev */}
        <PagerLink href={`${baseHref}?page=${Math.max(1, page - 1)}`} disabled={page <= 1}>
          ‹ Prev
        </PagerLink>

        {/* Numbers (small catalogs → show all) */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <PagerLink
            key={n}
            href={`${baseHref}?page=${n}`}
            active={n === page}
          >
            {n}
          </PagerLink>
        ))}

        {/* Next */}
        <PagerLink href={`${baseHref}?page=${Math.min(totalPages, page + 1)}`} disabled={page >= totalPages}>
          Next ›
        </PagerLink>
      </nav>
    </main>
  );
}

function PagerLink({ href, children, disabled, active }) {
  const base =
    'px-3 py-1.5 rounded-md border transition';
  const normal =
    'border-neutral-200 text-neutral-700 hover:bg-neutral-50';
  const on =
    'border-neutral-900 bg-neutral-900 text-white';
  const off =
    'opacity-40 pointer-events-none';

  const cls = [base, active ? on : normal, disabled ? off : ''].join(' ');

  if (disabled) return <span className={cls}>{children}</span>;
  return <Link href={href} className={cls}>{children}</Link>;
}