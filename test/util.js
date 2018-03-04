const path = require('path');
const webpack = require('webpack');
const denodeify = require('denodeify');
const dircompare = require('dir-compare');

const fixtures = path.resolve(__dirname, 'fixtures');
module.exports.expected = path.resolve(fixtures, 'expected');
module.exports.logo = path.resolve(fixtures, 'logo.svg');

module.exports.generate = async (plugins) => await denodeify(webpack)({
  entry: path.resolve(fixtures, 'entry.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', plugins.length + ''),
  },
  plugins,
});

module.exports.compare = async (a, b) => {
  const diff = await dircompare.compare(a, b, {compareSize: true});
  return diff.diffSet.filter(({state}) => state !== 'equal').map(({name1, name2}) => `${name1} ≠ ${name2}`);
};
