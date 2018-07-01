const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('../../src/');

module.exports = (env, args) => {
  return {
    context: __dirname,
    entry: './src/app.js',
    output: {
      path: path.resolve(__dirname, 'public'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new WebappWebpackPlugin('./src/logo.svg'),
    ],
    stats: "errors-only"
  };
}
