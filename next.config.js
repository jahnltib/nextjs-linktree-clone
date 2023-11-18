/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["replacewithyourdomain.supabase.co"]
  }
}

module.exports = nextConfig

