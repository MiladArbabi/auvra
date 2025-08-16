import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';

const intl = createMiddleware({
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export default function middleware(req) {
  const res = intl(req);

  // Set a country cookie if missing (use platform geo or default SE)
  const has = req.cookies.get('shopifyCountry');
  if (!has) {
    const guess = (req.geo?.country || 'SE').toUpperCase();
    res.cookies.set('shopifyCountry', guess, {path: '/', maxAge: 60 * 60 * 24 * 365});
  }
  return res;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
