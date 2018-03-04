import test from 'ava';
import WebappWebpackPlugin from '..';

import {logo} from './util';

test('should throw error when called without arguments', t => {
  try {
    new WebappWebpackPlugin();
  } catch (err) {
    t.is(err.message, 'WebappWebpackPlugin options are required');
  }
});

test('should take a string as argument', t => {
  const plugin = new WebappWebpackPlugin(logo);
  t.is(plugin.options.logo, logo);
});

test('should take an object with just the logo as argument', t => {
  const plugin = new WebappWebpackPlugin({logo});
  t.is(plugin.options.logo, logo);
});
