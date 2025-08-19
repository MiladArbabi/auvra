// src/lib/seo.js
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// map app locales → hreflang codes
export const HREFLANGS = {
  en: 'en',
  sv: 'sv-SE',
};
export const OG_LOCALES = {
  en: 'en_US',
  sv: 'sv_SE',
};
export function ogLocaleFor(loc) {
  return OG_LOCALES[loc] || loc;
}

// Build absolute URL
export function absUrl(path = '/') {
  try { return new URL(path, SITE_URL).toString(); }
  catch { return `${SITE_URL.replace(/\/+$/,'')}${path.startsWith('/')?'':'/'}${path}`; }
}

export function metadataBase() {
  return new URL(SITE_URL);
}

// Canonical for a given route (no querystring)
export function canonicalFor(locale, path) {
  return `/${locale}${path.startsWith('/') ? '' : '/'}${path}`.replace(/\/+$/,'') || `/${locale}`;
}

// Hreflang alternates for the same route across locales
export function alternatesFor(path) {
  const entries = Object.keys(HREFLANGS).map(loc => [HREFLANGS[loc], `/${loc}${path}`]);
  return Object.fromEntries(entries);
}

// Organization JSON-LD (basic)
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Auvra',
    url: SITE_URL,
    logo: absUrl('/logo_v01.svg')
  };
}

// PLP/Collection JSON-LD (very light)
export function collectionJsonLd({ name, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url
  };
}