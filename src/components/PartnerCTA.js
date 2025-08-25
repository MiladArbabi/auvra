// src/components/PartnerCTA.js
 'use client';

import { affiliateClick } from '@/lib/track';

export default function PartnerCTA({ href, locale, country, handle, title, className }) {
  const UTM_SOURCE = process.env.NEXT_PUBLIC_UTM_SOURCE || 'auvra';
  function withUtm(u) {
    try {
      const url = new URL(u);
      if (!url.searchParams.get('utm_source')) url.searchParams.set('utm_source', UTM_SOURCE);
      if (!url.searchParams.get('utm_medium')) url.searchParams.set('utm_medium', 'affiliate');
      if (!url.searchParams.get('utm_campaign')) url.searchParams.set('utm_campaign', 'pdp_cta');
      if (!url.searchParams.get('utm_term')) url.searchParams.set('utm_term', handle);
      return url.toString();
    } catch {
      return u;
    }
  }
  const out = withUtm(href);

  return (
    <a
      href={out}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={className}
      onClick={() => {
        affiliateClick({
          location: 'pdp',
          locale,
          country,
          product_handle: handle,
          product_title: title,
          partner_url: out,
          campaign: 'pdp_cta',
        });
      }}
    >
      {locale === 'sv' ? 'Se pris hos partner' : 'See price on partner site'}
    </a>
  );
}