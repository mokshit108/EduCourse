/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  },
}

module.exports = nextConfig