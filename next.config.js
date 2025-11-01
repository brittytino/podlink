/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Add this so Next.js knows you’re intentionally using Turbopack
  turbopack: {},

  images: {
    // ✅ Replaces deprecated `images.domains`
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Keep your custom externals
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });
    return config;
  },
};

module.exports = nextConfig;
