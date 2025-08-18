import Providers from '@/components/Providers';
import en from '@/messages/en.json';
import sv from '@/messages/sv.json';

export default async function LocaleLayout({children, params}) {
  const {locale} = await params; // params is a Promise in Next 15
  const messages = locale === 'sv' ? sv : en;

  // Keep <html>/<body> only in ROOT layout; this layout just provides context
  return (
   <Providers locale={locale} messages={messages}>
     <div className="min-h-screen flex flex-col">
       {children}
     </div>
   </Providers>
 );
}
