const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const WebappWebpackPlugin = require('../');

const { logo, generate, mkdir, compare, expected } = require('./util');

test.beforeEach(async t => t.context.root = await mkdir());

test('should trigger webappWebpackPluginBeforeEmit hook', async t => {
  t.plan(2);

  const dist = path.join(t.context.root, 'dist');
  await generate({
    context: t.context.root,
    output: {
      path: dist,
    },
    plugins: [
      new WebappWebpackPlugin({ logo }),
      new class {
        apply(compiler) {
          compiler.hooks.make.tapPromise('Test', async compilation =>
            compilation.hooks.webappWebpackPluginBeforeEmit.tapPromise('Test', async result => {
              t.pass();
              return result;
            })
          );
        }
      },
    ]
  });

  t.deepEqual(await compare(dist, path.resolve(expected, 'default')), []);
});

test.afterEach(t => fs.remove(t.context.root));
