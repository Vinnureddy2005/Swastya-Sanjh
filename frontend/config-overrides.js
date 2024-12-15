const { override, disableEsLint, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  disableEsLint(),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),
  (config) => {
    config.ignoreWarnings = [
      {
        module: /node_modules\/@stream-io\/video-react-sdk/,
        message: /Failed to parse source map/,
      },
    ];
    return config;
  }
);
