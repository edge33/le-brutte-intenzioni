const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AfterBuildPlugin = require('@fiverr/afterbuild-webpack-plugin');
const replace = require('replace-in-file');
const fs = require('fs');

module.exports = (env) => {
  const browser = env.browser;
  return {
    entry: {
      popup: './src/popup/index.ts',
      content: ['./src/contentScripts/content.ts'],
    },
    output: {
      path: path.resolve(__dirname, `dist-${browser}`),
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(js|ts)x?$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
    plugins: [
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
        const distFiles = fs.readdirSync(`dist-${browser}`);
        const jsFiles = distFiles.filter((t) => t.endsWith('.js'));
        fs.copyFileSync(`src/manifest-${browser}.json`, `dist-${browser}/manifest.json`);
        for (const file of jsFiles) {
          let [fileName, hash] = file.split('.').slice(0, 2);
          replace.sync({
            files: `dist-${browser}/manifest.json`,
            from: `${fileName}.%contentHash%`,
            to: `${fileName}.${hash}`,
          });
        }
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
};
