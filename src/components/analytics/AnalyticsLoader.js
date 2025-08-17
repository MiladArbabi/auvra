// src/components/analytics/AnalyticsLoader.js
'use client';

import {useEffect} from 'react';
import Script from 'next/script';
import {usePathname, useSearchParams} from 'next/navigation';
import {useConsent} from '@/components/consent/ConsentContext';

const GA_ID   = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TT_ID   = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export default function AnalyticsLoader() {
  const {consent, ready} = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allowAnalytics = !!consent?.analytics;
  const allowMarketing = !!consent?.marketing;

  // Fire virtual pageviews on route changes (after initial).
  useEffect(() => {
    if (!ready || consent == null) return; // undecided or not mounted
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

  // Don’t render any tags until the user has made a choice.
  if (!ready || consent == null) return null;

  return (
    <>
      {/* GA4 (analytics) */}
      {allowAnalytics && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                anonymize_ip: true,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
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
            {/* helps validators; harmless in React since noscript is ignored in CSR */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{display:'none'}}
                 src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`} alt=""/>
          </noscript>
        </>
      )}

      {/* TikTok Pixel (marketing) */}
      {allowMarketing && TT_ID && (
        <Script id="ttq-init" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t; var ttq=w[t]=w[t]||[];
              ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'],
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';
              ttq._i=ttq._i||{}, ttq._i[e]=[], ttq._i[e]._u=i, ttq._t=ttq._t||{}, ttq._t[e]=+new Date;
              var o=d.createElement('script');o.type='text/javascript',o.async=!0,o.src=i;
              var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a); ttq._load = o;};
              ttq.load('${TT_ID}'); ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}
