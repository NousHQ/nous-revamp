/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-00.iconduck.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
