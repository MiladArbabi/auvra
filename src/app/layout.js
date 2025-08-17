// src/app/layout.js
import {Suspense} from 'react';
import {ConsentProvider} from '@/components/consent/ConsentContext';
import ConsentBanner from '@/components/consent/ConsentBanner';
import AnalyticsLoader from '@/components/analytics/AnalyticsLoader';
import Link from 'next/link';
import ManageCookies from '@/components/ManageCookies';

export const metadata = {
  alternates: { languages: { en: '/en', sv: '/sv' } }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* analytics + consent */}
        <script></script>
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
