export const metadata = {
  metadataBase: new URL('https://auvra.shop'),
  title: { default: 'Auvra', template: '%s · Auvra' },
  description: 'EU-compliant clean beauty with fast shipping in Nordics.',
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      sv: '/sv'
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
