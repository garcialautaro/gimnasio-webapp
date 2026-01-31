/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@turnos/shared'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only packages in client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@mapbox/node-pre-gyp': false,
        'mock-aws-s3': false,
        'aws-sdk': false,
        'nock': false,
        'bcrypt': false,
        'typeorm': false,
        'mysql2': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
