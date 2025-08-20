// src/components/analytics/AnalyticsLoader.js
'use client';

import {useEffect} from 'react';
import Script from 'next/script';
import {usePathname, useSearchParams} from 'next/navigation';
import {useConsent} from '@/components/consent/ConsentContext';
import dynamic from 'next/dynamic'

const GA_ID   = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TT_ID   = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export default function AnalyticsLoader() {
  const {consent, ready} = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Gate tag rendering by consent + presence of IDs
  const allowAnalytics = ready && !!consent?.analytics && !!GA_ID;
  const allowMarketing = ready && !!consent?.marketing && (!!META_ID || !!TT_ID);

  // ----- Consent Mode v2: update when user choice is known -----
  useEffect(() => {
    if (!ready || consent == null) return; // undecided
    const update = {
      ad_user_data:           consent.marketing ? 'granted' : 'denied',
      ad_personalization:     consent.marketing ? 'granted' : 'denied',
      ad_storage:             consent.marketing ? 'granted' : 'denied',
      analytics_storage:      consent.analytics ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage:      'granted',
    };
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', update);
    }
  }, [ready, consent]);

  // Fire virtual pageviews on route changes (after initial).
  useEffect(() => {
    if (!ready || consent == null) return;
    const path = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    if (allowAnalytics && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: path });
    }
    if (allowMarketing && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
    if (allowMarketing && typeof window.ttq?.page === 'function') {
      window.ttq.page();
    }
  }, [ready, consent, allowAnalytics, allowMarketing, pathname, searchParams]);

  return (
    <>
      {/* Google Consent Mode v2: defaults (always render) */}
      <Script id="gcm-defaults" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'granted',
            'security_storage': 'granted'
          });
        `}
      </Script>

      {/* GA4 */}
      {allowAnalytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: false,
              anonymize_ip: true,
              allow_ad_personalization_signals: false
            });
          `}</Script>
        </>
      )}

      {/* Meta Pixel (marketing) */}
      {allowMarketing && META_ID && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n; n.push=n; n.loaded=!0;n.version='2.0';
              n.queue=[]; t=b.createElement(e);t.async=!0;
              t.src=v; s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{display:'none'}}
                 src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`} alt=""/>
          </noscript>
        </>
      )}

      {/* TikTok */}
      {allowMarketing && TT_ID && (
        <Script id="ttq" strategy="afterInteractive">{`
          (function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = w[t];
            if (!Array.isArray(ttq)) { ttq = []; w[t] = ttq; }
            ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];
            ttq.setAndDefer = function(obj, m){ obj[m] = function(){ ttq.push([m].concat([].slice.call(arguments,0))) } };
            for (var i=0; i<ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function(name){ var inst = (ttq._i && ttq._i[name]) || []; for (var j=0; j<ttq.methods.length; j++) ttq.setAndDefer(inst, ttq.methods[j]); return inst; };
            ttq.load = function(id, opts){
              var u='https://analytics.tiktok.com/i18n/pixel/events.js';
              ttq._i = ttq._i || {}; ttq._i[id] = []; ttq._i[id]._u = u;
              ttq._t = ttq._t || {}; ttq._t[id] = +new Date;
              ttq._o = ttq._o || {}; ttq._o[id] = opts || {};
              var s = d.createElement('script'); s.type='text/javascript'; s.async=true; s.src = u + '?sdkid=' + id + '&lib=' + t;
              var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
              ttq._loaded = true;
            };
            if (!ttq._loaded) ttq.load('${TT_ID}');
          })(window, document, 'ttq');
        `}</Script>
      )}
    </>
  );
}