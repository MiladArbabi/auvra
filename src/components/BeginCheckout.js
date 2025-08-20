// src/components/BeginCheckout.js
'use client';
import { useEffect } from 'react';

export default function BeginCheckout({ formId, value, currency }) {
  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;

    const onSubmit = () => {
      const v = typeof value === 'number' ? value : undefined;
      try {
        // GA4
        if (window.gtag) {
          window.gtag('event', 'begin_checkout', {
            currency,
            value: v,
          });
        }
        // Meta
        if (window.fbq) {
          window.fbq('track', 'InitiateCheckout', {
            currency,
            value: v,
          });
        }
        // TikTok
        if (window.ttq && window.ttq.track) {
          window.ttq.track('InitiateCheckout', {
            currency,
            value: v,
          });
        }
      } catch {}
    };

    form.addEventListener('submit', onSubmit, { once: true });
    return () => form.removeEventListener('submit', onSubmit);
  }, [formId, value, currency]);

  return null;
}