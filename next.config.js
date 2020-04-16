require('dotenv').config();

const nextConfig = {
  env: {
    INVOICES_URL: process.env.INVOICES_URL,
    WEBSITE_URL: process.env.WEBSITE_URL,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
  webpack: (config) => {
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
