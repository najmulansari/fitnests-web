/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Vercel Blob — public CDN hostname for uploaded assets
      {
        protocol: "https",
        hostname: "*.public.blob.vercel.storage",
      },
    ],
  },
};

module.exports = nextConfig;
