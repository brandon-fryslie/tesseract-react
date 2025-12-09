module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ];
  const plugins = [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-transform-class-properties", { loose: true }],
    ["@babel/plugin-transform-private-methods", { loose: true }],
    ["@babel/plugin-transform-private-property-in-object", { loose: true }]
  ];

  return {
    presets,
    plugins
  };
};
