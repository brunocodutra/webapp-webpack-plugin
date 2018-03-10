import test from 'ava';
import WebappWebpackPlugin from '../src';

import {logo, mkdir} from './util';

test('should throw error when instantiated without a logo', t => {
  try {
    new WebappWebpackPlugin();
  } catch (err) {
    t.is(err.message, 'WebappWebpackPlugin options are required');
  }

  try {
    new WebappWebpackPlugin({});
  } catch (err) {
    t.is(err.message, 'An input file is required');
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
