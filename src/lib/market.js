// src/lib/market.js
import {cookies} from 'next/headers';

// --- server-only helper (await cookies())
export async function getCountry(fallback = 'SE') {
  const jar = await cookies();
  const v = jar.get('shopifyCountry')?.value;
  return (v || fallback).toUpperCase();
}

// --- EU utility (keep simple list)
const EU = new Set(['SE','DK','NO','FI','IS','DE','FR','ES','IT','NL','BE','AT','IE','PT','GR','PL','CZ','SK','HU','SI','HR','RO','BG','EE','LV','LT','LU','MT','CY']);
export function isEU(code) { return EU.has(String(code||'').toUpperCase()); }

// --- Language mapping for Storefront API
export function localeToLanguage(locale) {
  return String(locale).toLowerCase() === 'sv' ? 'SV' : 'EN';
}

// --- BCP47 tag (for Intl.NumberFormat)
export function localeTag(locale, country) {
  const lang = String(locale).toLowerCase() === 'sv' ? 'sv' : 'en';
  const c = String(country||'SE').toUpperCase();
  return `${lang}-${c}`;
}

// --- Currency formatter
export function formatMoney(amount, currency, tag) {
  const n = Number(amount);
  if (!isFinite(n)) return '';
  try {
    return new Intl.NumberFormat(tag, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol'
    }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

export const MARKET = {
  SE: {
    currency: 'SEK',
    freeShippingThreshold: 499, // kr
    standardRate: 49,           // kr
  },
};

// Currency by country (fallback EUR for non-configured)
export function currencyForCountry(code = 'SE') {
  const c = String(code).toUpperCase();
  return MARKET[c]?.currency || 'EUR';
}

// Human note for shipping
export function shippingNote(country, tag) {
  const c = String(country).toUpperCase();
  if (c === 'SE') {
    const t = MARKET.SE.freeShippingThreshold;
    return `Free shipping over ${formatMoney(t, MARKET.SE.currency, tag)}`;
  }
  return 'Shipping calculated at checkout';
}