const path = require('path');
const webpackConfig = {
  entry: {
    'main': './source/js/main.ts',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  mode: 'development',
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'source/js'),
        ],
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
  },
  watch: true,
};

module.exports = webpackConfig;
