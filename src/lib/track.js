// Unified client-side tracking helpers.
// Safe to import in client components only.
// src/lib/track.js
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true';

function log(...args) { if (DEBUG) console.info('[track]', ...args); }
function readConsent() {
  try {
    const m = document.cookie.match(/(?:^|;\\s*)consent_prefs=([^;]*)/);
    if (!m) return null;
    return JSON.parse(decodeURIComponent(m[1]));
  } catch { return null; }
}

function allow(kind) {
  const c = readConsent();
  if (!c) return false;
  if (kind === 'analytics') return !!c.analytics;
  if (kind === 'marketing') return !!c.marketing;
  return false;
}

// ---------- GA4 wrapper ----------
function ga(event, params) {
  if (!allow('analytics')) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  log('GA4', event, params);
  window.gtag('event', event, params || {});
}

// ---------- Meta wrapper ----------
function fb(event, params) {
  if (!allow('marketing')) return;
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  log('FB', event, params);
  window.fbq('track', event, params || {});
}

// ---------- TikTok wrapper ----------
function tt(event, params) {
  if (!allow('marketing')) return;
  if (typeof window === 'undefined' || typeof window.ttq?.track !== 'function') return;
  log('TT', event, params);
  window.ttq.track(event, params || {});
}

// ---------- Public helpers ----------
export function viewItem({id, title, price, currency}) {
  // GA4
  ga('view_item', {
    currency,
    value: price,
    items: [{ item_id: id, item_name: title, price }]
  });
  // Meta
  fb('ViewContent', {
    content_ids: [id],
    content_type: 'product',
    value: price,
    currency
  });
  // TikTok
  tt('ViewContent', {
    content_id: id,
    content_type: 'product',
    value: price,
    currency
  });
}

export function addToCart({id, title, price, currency, quantity=1}) {
  ga('add_to_cart', {
    currency,
    value: price * quantity,
    items: [{ item_id: id, item_name: title, price, quantity }]
  });
  fb('AddToCart', {
    content_ids: [id],
    content_type: 'product',
    value: price * quantity,
    currency
  });
  tt('AddToCart', {
    content_id: id,
    value: price * quantity,
    currency,
    quantity
  });
}

export function beginCheckout({value, currency, items}) {
  ga('begin_checkout', { currency, value, items: items.map(x => ({
    item_id: x.id, item_name: x.title, price: x.price, quantity: x.quantity
  })) });
  fb('InitiateCheckout', { value, currency });
  tt('InitiateCheckout', { value, currency });
}

export function purchase({transaction_id, value, currency, items}) {
  ga('purchase', {
    transaction_id,
    value,
    currency,
    items: items.map(x => ({
      item_id: x.id, item_name: x.title, price: x.price, quantity: x.quantity
    }))
  });
  fb('Purchase', { value, currency });
  tt('CompletePayment', { value, currency, order_id: transaction_id });
}

export function experimentExposure({ id, variant }) {
  // GA4
  ga('experiment_exposure', { experiment_id: id, variant });

  // Meta custom event
  if (allow('marketing') && typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'ExperimentExposure', { experiment_id: id, variant });
  }

  // TikTok custom event
  if (allow('marketing') && typeof window !== 'undefined' && window.ttq?.track) {
    window.ttq.track('ExperimentExposure', { experiment_id: id, variant });
  }
}