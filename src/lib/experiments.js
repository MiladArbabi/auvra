// src/lib/experiments.js
export function getVariantFromHeaders(headers, key) {
  const cookie = headers.get('cookie') || '';
  const m = cookie.match(new RegExp(`(?:^|;\\s*)exp_${key}=([^;]+)`));
  return m ? m[1] : 'A';
}