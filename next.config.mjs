// File: next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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