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
      publicPath: '/myapp/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),

      new WebappWebpackPlugin({
        logo: './src/logo.svg',
        prefix: 'path/to/assets/',

        // Favicons configuration
        // For the complete list of options, see https://github.com/evilebottnawi/favicons#usage
        favicons: {
          appName: 'My WebApp',
          appShortName: 'WebApp',
          appDescription: 'My awesome WebApp',
          developerName: 'Me',
          developerURL: "https://github.com/me/",
          version: "1.0.0",
        },
      }),

      new class {
        apply(compiler) {
          compiler.hooks.make.tapAsync("CustomPlugin", (compilation, callback) => {
            compilation.hooks.webappWebpackPluginBeforeEmit.tapAsync("CustomPlugin", (result, callback) => {
              console.log(result.assets.map(({name}) => name));
              console.log()
              console.log("### Add custom logic to modify assets here ###");
              console.log()
              return callback(null, result);
            });

            return callback();
          })
        }
      }
    ],

    stats: "errors-only"
  };
}
