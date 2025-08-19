// src/app/[locale]/layout.js
import Providers from '@/components/Providers';
import { metadataBase, orgJsonLd, HREFLANGS, ogLocaleFor } from '@/lib/seo';
import en from '@/messages/en.json';
import sv from '@/messages/sv.json';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    metadataBase: metadataBase(),
    // Default robots & basic OG — refine later
    robots: { index: true, follow: true },
    alternates: {
      // per-page canonicals are set in pages; this is a safe base
      languages: Object.fromEntries(
        Object.entries(HREFLANGS).map(([loc, tag]) => [tag, `/${loc}`])
      ),
      canonical: undefined,
    },
    openGraph: {
      siteName: 'Auvra',
      locale: ogLocaleFor(locale),
      type: 'website',
      alternateLocale: Object.values({ en: 'en_US', sv: 'sv_SE' }).filter(l => l !== ogLocaleFor(locale)),
    },
  };
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params; // params is a Promise in Next 15
  const messages = locale === 'sv' ? sv : en;

  // Keep <html>/<body> only in ROOT layout; this layout just provides context
  return (
   <Providers locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd()) }}
        />
        {children}
      </div>
    </Providers>
 );
}
