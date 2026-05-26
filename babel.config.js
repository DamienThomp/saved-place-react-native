module.exports = function (api) {
  api.cache(true);
  const plugins = ['babel-plugin-react-compiler'];

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
