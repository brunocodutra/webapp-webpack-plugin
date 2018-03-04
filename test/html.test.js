const test = require('ava');
const path = require('path');
const rimraf = require('rimraf');
const denodeify = require('denodeify');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('..');
const util = require('./util');

test('should work together with the html-webpack-plugin', async t => {
  const stats = await util.generate([
    new HtmlWebpackPlugin(),
    new WebappWebpackPlugin({logo: util.logo}),
  ]);

  t.context.dist = stats.compilation.compiler.outputPath;
  const diff = await util.compare(t.context.dist, path.resolve(util.expected, 'html'));
  t.deepEqual(diff, []);
});

test.afterEach(t => denodeify(rimraf)(t.context.dist));
