/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@privaudit/proofs', '@privaudit/core', '@privaudit/ai'],
}

module.exports = nextConfig