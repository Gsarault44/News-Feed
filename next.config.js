/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["/^[^.]*/", "variety.com"]
  }
}

module.exports = nextConfig
