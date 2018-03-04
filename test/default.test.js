const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const WebappWebpackPlugin = require('..');
const util = require('./util');

test('should generate the expected default result', async t => {
  const stats = await util.generate([new WebappWebpackPlugin({logo: util.logo})]);

  t.context.dist = stats.compilation.compiler.outputPath;
  const diff = await util.compare(t.context.dist, path.resolve(util.expected, 'default'));
  t.deepEqual(diff, []);
});

test.afterEach(t => fs.remove(t.context.dist));
