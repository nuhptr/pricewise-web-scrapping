/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      serverComponentsExternalPackages: ["mongosee"],
   },
   images: {
      remotePatterns: [{ protocol: "https", hostname: "m.media-amazon.com" }],
   },
}

module.exports = nextConfig
