/*  eslint-disable-next-line import/no-unresolved */

const nextConfig = {
  webpack: config => {
    config.module.rules.push({
      test: /public\/.*\.(jpg|gif|png|svg|)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          fallback: 'file-loader',
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
