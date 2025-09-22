/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ['@privaudit/proofs', '@privaudit/core', '@privaudit/ai'],
  },
  webpack: (config) => {
    // Handle node modules that need special treatment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
