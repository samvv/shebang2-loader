
const fs = require('fs');
const webpack = require("webpack");
const path = require("path");

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.m?js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: path.resolve(__dirname, 'index.js'), loader: "shebang2-loader" },
    ]
  }
};

