// src/lib/consent.js
export const CONSENT_COOKIE = 'consent_prefs';

function readRaw() {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|;\s*)consent_prefs=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function readConsent() {
  try {
    const raw = readRaw();
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeConsent(prefs) {
  if (typeof document === 'undefined') return;
  const v = encodeURIComponent(JSON.stringify({ ...prefs, ts: Date.now() }));
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${v}; Path=/; Max-Age=${oneYear}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent('consentchange', { detail: prefs }));
}
