'use client';
import {NextIntlClientProvider} from 'next-intl';
import en from '@/messages/en.json';
import sv from '@/messages/sv.json';

export default function LocaleLayout({children, params: {locale}}) {
  const messages = locale === 'sv' ? sv : en;
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
