export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: 'https://auvra.shop/en',
      lastModified,
      alternates: { languages: { en: 'https://auvra.shop/en', sv: 'https://auvra.shop/sv' } }
    },
    {
      url: 'https://auvra.shop/sv',
      lastModified,
      alternates: { languages: { en: 'https://auvra.shop/en', sv: 'https://auvra.shop/sv' } }
    }
  ];
}
