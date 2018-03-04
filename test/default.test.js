const test = require('ava');
const path = require('path');
const rimraf = require('rimraf');
const denodeify = require('denodeify');
const WebappWebpackPlugin = require('..');
const util = require('./util');

test('should generate the expected default result', async t => {
  const stats = await util.generate([new WebappWebpackPlugin({logo: util.logo})]);

  t.context.dist = stats.compilation.compiler.outputPath;
  const diff = await util.compare(t.context.dist, path.resolve(util.expected, 'default'));
  t.deepEqual(diff, []);
});

test.afterEach(t => denodeify(rimraf)(t.context.dist));
