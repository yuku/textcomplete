/* eslint-env node */
/* eslint-disable camelcase */

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const defaultConfig = {
  devtool: 'source-map',
  entry: {
    textcomplete: './src/main.js',
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
    path: path.join(__dirname, 'dist'),
    filename: 'textcomplete.codemirror.js',
  },
};

module.exports = function (env) {
  if (!env) {
    return defaultConfig;
  }

  if (env === 'min') {
    return webpackMerge(defaultConfig, {
      output: {
        filename: 'textcomplete.codemirror.min.js',
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          mangle: {
            // We do not use Function.prototype.name.
            keep_fnames: false,
            // We do not support IE8.
            screw_ie8: true,
          },
          compress: {
            // We do not use Function.length.
            keep_fargs: false,
            // We do not use Function.prototype.name.
            keep_fnames: false,
            // We do not support IE8.
            screw_ie8: true,
          },
          comments: false,
          sourceMap: true,
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
        }),
      ],
    });
  }

  throw `Unknown env ${env}`;
};
