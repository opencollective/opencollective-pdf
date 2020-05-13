require('dotenv').config();

const nextConfig = {
  env: {
    WEBSITE_URL: process.env.WEBSITE_URL,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
  webpack: (config) => {
    // Inline images
    config.module.rules.push({
      test: /public\/.*\.(jpg|gif|png|svg|)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1000000,
          fallback: 'file-loader',
        },
      },
    });

    // Inline fonts
    config.module.rules.push({
      test: /\.(ttf|eot|svg|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 750000, // 1mo
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
