/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aws-tufirma-dev-v2.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  // Deshabilitamos la configuración de webpack para SVG ya que usaremos next/image
  webpack(config) {
    return config;
  },
};

export default withNextIntl(nextConfig);
