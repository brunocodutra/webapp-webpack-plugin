const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const WebappWebpackPlugin = require('../');

const {logo, generate, mkdir, compare, expected, tap} = require('./util');

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
      new WebappWebpackPlugin({logo}),
      new class {
        apply(compiler) {
          tap(compiler, "make", "Plugin", (compilation, callback) => {
            tap(compilation, "webapp-webpack-plugin-before-emit", "Plugin", (result, callback) => {
              t.pass();
              return callback(null, result);
            });

            return callback();
          })
        }
      },
    ]
  });

  t.deepEqual(await compare(dist, path.resolve(expected, 'default')), []);
});

test.afterEach(t => fs.remove(t.context.root));
