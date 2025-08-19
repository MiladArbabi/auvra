/** @type {import('next').NextConfig} */
const nextConfig = {
  // allow LAN access without warnings while developing (Next 15+)
  allowedDevOrigins: ['localhost', '192.168.0.31'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '*.myshopify.com' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.auvra.shop' }],
        destination: 'https://auvra.shop/:path*',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
