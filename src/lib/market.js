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
