// src/app/layout.js
import {Suspense} from 'react';
import {ConsentProvider} from '@/components/consent/ConsentContext';
import ConsentBanner from '@/components/consent/ConsentBanner';
import AnalyticsLoader from '@/components/analytics/AnalyticsLoader';
import Link from 'next/link';
import ManageCookies from '@/components/ManageCookies';

export const metadata = {
  alternates: { languages: { en: '/en', sv: '/sv' } },
  other: { 'google-site-verification': 'DFTZV93X5MJBOTYAq_4Ee1ITolaaAF7cg-96VQGhc_A' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Meta Pixel <noscript> fallback */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}

        {/* analytics + consent */}
        <ConsentProvider>
          <Suspense fallback={null}><AnalyticsLoader /></Suspense>
          <ConsentBanner />
          {children}
          <footer className="mt-16 border-t">
            <div className="mx-auto max-w-5xl p-6 text-sm text-neutral-600">
              <ManageCookies /> • <Link className="underline" href="/en/privacy">Privacy</Link>
            </div>
          </footer>
        </ConsentProvider>
      </body>
    </html>
  );
}
