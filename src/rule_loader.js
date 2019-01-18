module.exports = function () {
  const callback = this.async();
  const { plugin } = this.query;

  plugin.tags.promise
    .then(tags => {
      callback(null, `module.exports = ['${tags.join("', '")}'];`);
    })
    .catch(callback);
};
