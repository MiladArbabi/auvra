// src/components/AnalyticsGate.js
'use client';
import {useEffect, useRef} from 'react';
import {readConsent} from '@/lib/consent';

function loadScript(src, id) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id; s.async = true; s.src = src;
  document.head.appendChild(s);
}
function injectInline(id, code) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id; s.innerHTML = code;
  document.head.appendChild(s);
}

export default function AnalyticsGate() {
  const loaded = useRef({ga:false, meta:false, tt:false});

  const GA   = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const META = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const TT   = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  useEffect(() => {
    const apply = (prefs) => {
      if (!prefs) return;

      // --- GA4 Consent Mode v2 defaults (denied):
    if (GA) {
      injectInline('ga4-consent-default', `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)}
        gtag('consent', 'default', {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
          analytics_storage: 'denied'
        });
      `);
    }
      if (prefs.analytics && GA && !loaded.current.ga) {
        loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA}`, 'ga4-src');
        injectInline('ga4-init', `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());
          gtag('config', '${GA}');
        `);
        loaded.current.ga = true;
        console.info('[analytics] GA4 loaded', GA);
      }

      // Reflect consent to GA when banner changes
    if (window.gtag && GA) {
      const analytics = prefs.analytics ? 'granted' : 'denied';
      const ads = prefs.marketing ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        analytics_storage: analytics,
        ad_storage: ads,
        ad_user_data: ads,
        ad_personalization: ads
      });
    }

      if (prefs.marketing && META && !loaded.current.meta) {
        injectInline('fbq-init', `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js'); fbq('init','${META}'); fbq('track','PageView');
        `);
        loaded.current.meta = true;
        console.info('[analytics] Meta Pixel loaded', META);
      }

      if (prefs.marketing && TT && !loaded.current.tt) {
        injectInline('ttq-init', `
          !function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'],
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
          ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{},ttq._i[e]=[],
          ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
          var o=document.createElement('script');o.type='text/javascript',o.async=!0,o.src=i+'?sdkid='+e+'&lib='+t;
          var a=document.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a)};ttq.load('${TT}');ttq.page();
        `);
        loaded.current.tt = true;
        console.info('[analytics] TikTok Pixel loaded', TT);
      }
    };

    // initial apply + subscribe to changes
    apply(readConsent());
    const onChange = (e) => apply(e.detail);
    window.addEventListener('consentchange', onChange);
    return () => window.removeEventListener('consentchange', onChange);
  }, [GA, META, TT]);

  return null;
}
