import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // keeps / for default, but we'll still redirect '/' to '/en'
});

export const config = {
  matcher: ['/', '/(en|sv)/:path*']
};
