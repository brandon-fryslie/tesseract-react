const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonPaths = require('./paths');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: commonPaths.outputPath,
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel'],
          },
        },
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                mode: 'local',
                localIdentName: '[local]___[hash:base64:5]',
                auto: false,
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
            },
          },
        ],
      }
    ],
  },
  devServer: {
    static: {
      directory: commonPaths.root + '/public',
    },
    compress: true,
    hot: true,
    allowedHosts: 'all',
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/envConfig.js', to: 'envConfig.js' },
        { from: 'public/fonts', to: 'fonts' },
      ],
    }),
  ],
};
