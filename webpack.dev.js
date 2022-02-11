const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AfterBuildPlugin = require('@fiverr/afterbuild-webpack-plugin');
const replace = require('replace-in-file');
const ExtReloader = require('webpack-ext-reloader');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new ExtReloader(),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({ template: 'src/popup/index.html', chunks: ['popup'] }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/icons/icon16.png' },
        { from: './src/icons/icon48.png' },
        { from: './src/icons/icon128.png' },
      ],
    }),
    new AfterBuildPlugin(() => {
      const distFiles = fs.readdirSync('dist');
      const jsFiles = distFiles.filter((t) => t.endsWith('.js'));
      fs.copyFileSync('src/manifest.json', 'dist/manifest.json');
      for (const file of jsFiles) {
        let [fileName, hash] = file.split('.').slice(0, 2);
        replace.sync({
          files: 'dist/manifest.json',
          from: `${fileName}.%contentHash%`,
          to: `${fileName}.${hash}`,
        });
      }
    }),
  ],
});