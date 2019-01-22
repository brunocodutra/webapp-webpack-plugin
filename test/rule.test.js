const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const WebappWebpackPlugin = require('../');

const { logo, generate, mkdir, compare, expected } = require('./util');

test.beforeEach(async t => t.context.root = await mkdir());

test('should fail to generate rule with relative logo', t => {
  const plugin = new WebappWebpackPlugin({ logo: './path' });
  try {
    plugin.rule();
  } catch (err) {
    t.is(err.message, '`logo` must be an absolute path');
  }
});

test('should fail to generate rule with module logo', t => {
  const plugin = new WebappWebpackPlugin({ logo: 'path' });
  try {
    plugin.rule();
  } catch (err) {
    t.is(err.message, '`logo` must be an absolute path');
  }
});

test('should succeed to generate rule with absolute logo', t => {
  const plugin = new WebappWebpackPlugin({ logo: '/path' });
  const rule = plugin.rule();
  t.pass();
});

test('should generate working rule for getting favicon tags', async t => {
  const dist = path.join(t.context.root, 'dist');
  const plugin = new WebappWebpackPlugin({ logo });
  const rule = plugin.rule();

  await generate({
    entry: path.resolve(__dirname, 'fixtures/rule.js'),
    context: t.context.root,
    output: {
      path: dist,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      plugin,
    ],
    module: {
      rules: [rule],
    },
  }, {
      skipJs: false,
    });

  const actualTags = require(path.resolve(dist, 'main.js'));
  t.truthy(Array.isArray(actualTags));
  t.truthy(actualTags.length > 0);

  const expectedTags = require('./fixtures/expected/rule/main');
  t.deepEqual(actualTags, expectedTags);
});

test.afterEach(t => fs.remove(t.context.root));
