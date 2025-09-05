// src/app/layout.js
import {Suspense} from 'react';
import { Montserrat } from 'next/font/google';
import {ConsentProvider} from '@/components/consent/ConsentContext';
import ConsentBanner from '@/components/consent/ConsentBanner';
import AnalyticsLoader from '@/components/analytics/AnalyticsLoader';
import './globals.css';
import './theme.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  alternates: { languages: { en: '/en', sv: '/sv' } },
  other: { 'google-site-verification': 'DFTZV93X5MJBOTYAq_4Ee1ITolaaAF7cg-96VQGhc_A' },
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" className={montserrat.variable} suppressHydrationWarning>
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
        </ConsentProvider>
      </body>
    </html>
  );
}
