module.exports = function (api) {
  api.cache(true);

  const presets = ["@babel/preset-env"];
  const plugins = [["inline-json-import", {}]];

  return { presets, plugins };
};
