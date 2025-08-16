'use client';

import Script from 'next/script';
import {useEffect, useMemo, useRef} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {useConsent} from '@/components/consent/ConsentContext';

export default function AnalyticsLoader() {
  const {consent, ready} = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const FB = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const TT = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  // Wait until consent state is known
  const canAnalytics = ready && consent?.analytics && !!GA;
  const canMarketing = ready && consent?.marketing && (!!FB || !!TT);

  // fire route change events
  const prevPath = useRef('');
  const pageUrl = useMemo(() => {
    const qs = searchParams?.toString();
    return `${pathname || '/'}${qs ? `?${qs}` : ''}`;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!ready || consent == null) return; // undecided
    if (prevPath.current === pageUrl) return;
    prevPath.current = pageUrl;

    // GA4
    if (canAnalytics && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {page_path: pageUrl});
    }
    // Meta
    if (canMarketing && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
    // TikTok
    if (canMarketing && typeof window !== 'undefined' && window.ttq?.page) {
      window.ttq.page();
    }
  }, [pageUrl, ready, consent, canAnalytics, canMarketing]);

  return (
    <>
      {/* GA4 */}
      {canAnalytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', '${GA}', { send_page_view: false });
          `}</Script>
        </>
      )}

      {/* Meta Pixel */}
      {canMarketing && FB && (
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB}');
        `}</Script>
      )}

      {/* TikTok */}
      {canMarketing && TT && (
        <Script id="ttq" strategy="afterInteractive">{`
          !function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = w[t] = w[t] || [];
            ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];
            ttq.setAndDefer = function(t,e){ t[e]=function(){ t.push([e].concat(Array.prototype.slice.call(arguments,0))) } };
            for (var i=0; i<ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function(t){ var e = ttq._i[t] || []; for (var n=0; n<ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
            ttq.load = function(e,n){ var i='https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i=ttq._i||{}; ttq._i[e]=[]; ttq._i[e]._u=i; ttq._t = ttq._t || {}; ttq._t[e]=+new Date; ttq._o = ttq._o || {}; ttq._o[e]=n || {}; var o=document.createElement('script'); o.type='text/javascript'; o.async=!0; o.src=i+'?sdkid='+e+'&lib='+t; var a=document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o,a); };
            ttq.load('${TT}');
            w.ttq = ttq;
          }(window, document, 'ttq');
        `}</Script>
      )}
    </>
  );
}
