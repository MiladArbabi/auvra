import { HREFLANGS, absUrl } from '@/lib/seo';

export default function sitemap() {
  const lastModified = new Date();
  const locales = Object.keys(HREFLANGS); // e.g. ['en','sv']
  const defaultLocale = 'en'; // adjust if you change your default

  return locales.map((loc) => ({
    url: absUrl(`/${loc}`),
    lastModified,
    alternates: {
      languages: Object.fromEntries([
        ...locales.map((l2) => [HREFLANGS[l2], absUrl(`/${l2}`)]),
        // optional but recommended for Google:
        ['x-default', absUrl(`/${defaultLocale}`)],
      ]),
    },
  }));
}