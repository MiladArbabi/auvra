import {Suspense} from 'react';
import {ConsentProvider} from '@/components/consent/ConsentContext';
import ConsentBanner from '@/components/consent/ConsentBanner';
import AnalyticsLoader from '@/components/analytics/AnalyticsLoader';

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
        </ConsentProvider>
      </body>
    </html>
  );
}
