module.exports = async function () {
  const tags = await this.query.plugin.tags.promise;
  return `module.exports = ${JSON.stringify(tags)};`;
};
