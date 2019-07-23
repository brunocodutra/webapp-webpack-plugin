const assert = require('assert');
const parse5 = require('parse5');
const path = require('path');
const child = require('./compiler');
const Oracle = require('./oracle');

module.exports = class WebappWebpackPlugin {
  constructor(args) {
    const options = (typeof args === 'string') ? { logo: args } : args;
    assert(typeof options === 'object' && typeof options.logo === 'string', 'An input file is required');

    this.options = Object.assign({
      cache: true,
      inject: true,
      favicons: {},
      prefix: 'assets/',
    }, options);

    this.tags = {};
    this.tags.promise = new Promise((resolve, reject) => {
      this.tags.resolve = resolve;
      this.tags.reject = reject;
    });
    this.tags.promise.catch(() => { });
  }

  rule() {
    assert(path.isAbsolute(this.options.logo), '`logo` must be an absolute path');

    const rule = {
      include: path.resolve(this.options.logo),
      loader: require.resolve('./rule_loader'),
      options: { plugin: this },
    };

    return rule;
  }

  apply(compiler) {
    const oracle = new Oracle(compiler.context);

    {
      const {
        appName = oracle.guessAppName(),
        appDescription = oracle.guessDescription(),
        version = oracle.guessVersion(),
        developerName = oracle.guessDeveloperName(),
        developerURL = oracle.guessDeveloperURL(),
      } = this.options.favicons;

      Object.assign(this.options.favicons, {
        appName,
        appDescription,
        version,
        developerName,
        developerURL,
      });
    }

    if (typeof this.options.inject !== 'function') {
      const { inject } = this.options;
      this.options.inject = htmlPlugin =>
        inject === 'force'
        || htmlPlugin.options.favicons !== false && htmlPlugin.options.inject && inject;
    }

    compiler.hooks.make.tapPromise('WebappWebpackPlugin', async compilation => {
      try {
        // Generate favicons
        const tags = await child.run(this.options, compiler.context, compilation);
        this.tags.resolve(tags);

        // Hook into the html-webpack-plugin processing and add the html
        const htmlWebpackPlugin = compiler.options.plugins
          .map(({ constructor }) => constructor)
          .find(({ name }) => name === 'HtmlWebpackPlugin');

        if (htmlWebpackPlugin) {
          await htmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapPromise('WebappWebpackPlugin', async htmlPluginData => {
            if (this.options.inject(htmlPluginData.plugin)) {
              htmlPluginData.plugin.options.inject = true;
              [].push.apply(
                htmlPluginData.assetTags.meta,
                tags.map(tag => parse5.parseFragment(tag).childNodes[0]).map(({ tagName, attrs }) => ({
                  tagName,
                  voidTag: true,
                  attributes: attrs.reduce((obj, { name, value }) => Object.assign(obj, { [name]: value }), {}),
                })),
              );
            }
            return htmlPluginData;
          });
        }
      } catch (err) {
        this.tags.reject(err);
        throw err;
      }
    });
  }
}
