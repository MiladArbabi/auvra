// src/app/robots.js
export default function robots() {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === '1';

  if (comingSoon) {
    // Maintenance mode: block crawling, omit sitemap
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: undefined,
    };
  }

  // Normal mode: allow crawling + expose sitemap
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://auvra.shop/sitemap.xml',
  };
}