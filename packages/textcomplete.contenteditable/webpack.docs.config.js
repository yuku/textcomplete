/* eslint-env node */
/* eslint-disable camelcase */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  devServer: {
    contentBase: "docs",
    port: 8081,
  },
  entry: {
    main: './src/docs/main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'main.js',
  },
};
