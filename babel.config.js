module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          modules: 'auto',
          targets: { node: 'current' },
        },
        'transform-runtime': {
          useESModules: false,
        },
      },
    ],
  ],
  plugins: [
    'babel-plugin-styled-components',
    [
      'formatjs',
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        ast: true,
      },
    ],
  ],
  env: {
    development: {
      compact: false,
    },
  },
};
