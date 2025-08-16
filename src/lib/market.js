import {cookies, headers} from 'next/headers';

// Minimal EU list (27)
const EU = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
  'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
]);

export function getCountry(defaultCountry = 'SE') {
  // cookie from middleware or user choice
  const c = cookies().get('shopifyCountry')?.value;
  if (c && /^[A-Z]{2}$/.test(c)) return c;

  // (optional) header hint if running on edge/platforms that set it
  const h = headers().get('x-vercel-ip-country') || headers().get('x-country');
  if (h && /^[A-Z]{2}$/.test(h)) return h;

  return defaultCountry;
}

export function localeToLanguage(locale = 'en') {
  return String(locale).slice(0, 2).toUpperCase(); // 'en' -> 'EN', 'sv' -> 'SV'
}

export function localeTag(locale, country) {
  // e.g. 'sv' + 'SE' -> 'sv-SE'
  const l = String(locale || 'en').slice(0, 2);
  const c = (country || 'SE').toUpperCase();
  return `${l}-${c}`;
}

export function isEU(country) {
  return EU.has(String(country || '').toUpperCase());
}

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
