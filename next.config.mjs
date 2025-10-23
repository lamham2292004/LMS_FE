// File: next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8083',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.lms.com', // Cho production nếu có
        pathname: '/uploads/**',
      },
    ],
  },
  modularizeImports: {
    '@fortawesome/free-solid-svg-icons': {
      transform: '@fortawesome/free-solid-svg-icons/{{member}}',
      skipDefaultConversion: true,
    },
    '@fortawesome/free-regular-svg-icons': {
      transform: '@fortawesome/free-regular-svg-icons/{{member}}',
      skipDefaultConversion: true,
    },
    '@fortawesome/free-brands-svg-icons': {
      transform: '@fortawesome/free-brands-svg-icons/{{member}}',
      skipDefaultConversion: true,
    },
  },
  // Removed global redirect - let pages handle their own routing
};

export default nextConfig;