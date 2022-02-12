const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const ExtReloader = require('webpack-ext-reloader');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [new ExtReloader()],
  });
};
