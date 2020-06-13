/* eslint-env node */

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: 'docs',
    port: 8082,
  },
  entry: {
    main: './src/doc/main.js',
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
          ],
        }),
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'main.js',
  },
};
