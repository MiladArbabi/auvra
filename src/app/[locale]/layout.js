// src/app/[locale]/layout.js
import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import en from '@/messages/en.json';
import sv from '@/messages/sv.json';
import { getCollections } from '@/lib/shopify';
import { localeToLanguage } from '@/lib/market-utils';

export default async function LocaleLayout({children, params}) {
  const {locale} = await params; // params is a Promise in Next 15
  const messages = locale === 'sv' ? sv : en;
  const collections = await getCollections(locale);

  return (
   <Providers locale={locale} messages={messages}>
     <div className="min-h-screen flex flex-col">
        <Header collections={collections} />
        <main className='flex-grow'>
          {children}
        </main>
        <Footer />
     </div>
   </Providers>
 );
}
