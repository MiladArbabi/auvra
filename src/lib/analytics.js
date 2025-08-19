import {readConsent} from '@/lib/consent';

const hasWin = () => typeof window !== 'undefined';
const num = (v) => (typeof v === 'number' ? v : parseFloat(v || '0')) || 0;

const hasAnalytics = () => !!readConsent()?.analytics;
const hasMarketing = () => !!readConsent()?.marketing;

/* ------------------------ core emitters ------------------------ */
function emitGA4(event, params) {
  if (!hasWin() || !hasAnalytics()) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params || {});
}

function emitFB(event, params) {
  if (!hasWin() || !hasMarketing()) return;
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', event, params || {});
}

function emitTT(event, params) {
  if (!hasWin() || !hasMarketing()) return;
  if (!window.ttq || typeof window.ttq.track !== 'function') return;
  window.ttq.track(event, params || {});
}

/* ------------------------ helpers (public) --------------------- */
export function trackPageView(path) {
  emitGA4('page_view', { page_path: path });
  emitFB('PageView');
  if (window.ttq?.page) window.ttq.page();
}

export function trackViewItem({ id, title, price, currency, variantId, variantName }) {
  const value = num(price);
  const items = [{
    item_id: id, item_name: title,
    item_variant: variantName, item_variant_id: variantId,
    price: value, quantity: 1, currency
  }];
  emitGA4('view_item', { value, currency, items });
  emitFB('ViewContent', {
    content_ids: [id], content_type: 'product', content_name: title,
    value, currency
  });
  emitTT('ViewContent', { content_id: id, content_type: 'product', value, currency });
}

export function trackAddToCart({ id, title, price, currency, quantity = 1, variantId, variantName }) {
  const q = Math.max(1, Number(quantity || 1));
  const unit = num(price);
  const value = unit * q;
  const items = [{
    item_id: id, item_name: title,
    item_variant: variantName, item_variant_id: variantId,
    price: unit, quantity: q, currency
  }];
  emitGA4('add_to_cart', { value, currency, items });
  emitFB('AddToCart', {
    content_ids: [id], content_type: 'product', content_name: title,
    value, currency, contents: [{ id, quantity: q, item_price: unit }]
  });
  emitTT('AddToCart', { content_id: id, content_type: 'product', quantity: q, price: unit, value, currency });
}

export function trackBeginCheckout({ currency, value, items }) {
  // items: [{id,title,price,quantity}]
  const gaItems = (items || []).map(it => ({
    item_id: it.id, item_name: it.title, price: num(it.price),
    quantity: Number(it.quantity || 1), currency
  }));
  emitGA4('begin_checkout', { currency, value: num(value), items: gaItems });
  emitFB('InitiateCheckout', { currency, value: num(value) });
  emitTT('InitiateCheckout', { currency, value: num(value) });
}

export function trackPurchase({ currency, value, transaction_id, items }) {
  const gaItems = (items || []).map(it => ({
    item_id: it.id, item_name: it.title, price: num(it.price),
    quantity: Number(it.quantity || 1), currency
  }));
  emitGA4('purchase', { transaction_id, currency, value: num(value), items: gaItems });
  emitFB('Purchase', { currency, value: num(value) });
  emitTT('CompletePayment', { currency, value: num(value) });
}

export function trackCustom(name, params) {
  emitGA4(name, params);
  emitTT(name, params);
  // Meta has fbq('trackCustom', ...), keep basic for now:
  if (hasWin() && hasMarketing() && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, params || {});
  }
}