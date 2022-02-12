const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) => {
  console.log(`Building for: ${env.browser}`);
  return merge(common(env), {
    mode: 'production',
  });
};
