const TerserPlugin = require('terser-webpack-plugin');
const devConfig = require('./webpack.config');

// Make a shallow copy of the dev config and apply the following options on top.
const webpackConfig = Object.assign({}, devConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  watch: false,
});

// Extend the dev settings and add in extra plugins.
module.exports = webpackConfig;
