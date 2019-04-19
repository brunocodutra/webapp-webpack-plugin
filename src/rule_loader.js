module.exports = async function () {
  const callback = this.async();
  const { plugin } = this.query;

  try {
    const tags = await plugin.tags.promise;
    return callback(null, `module.exports = ['${tags.join("', '")}'];`);
  } catch (err) {
    return callback(err);
  }
};
