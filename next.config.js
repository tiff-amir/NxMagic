/* eslint-disable
@typescript-eslint/no-var-requires, import/no-extraneous-dependencies, global-require
*/
const path = require('path');
const fs = require('fs');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const locales = fs.readdirSync(path.join(__dirname, 'src/locales'))
  .filter((locale) => !locale.includes('.json'));
fs.writeFileSync(path.join(__dirname, 'src/locales/info.json'), JSON.stringify({
  default: locales.includes('en') ? 'en' : locales[0],
  list: locales,
}), 'utf8');

module.exports = {
  webpack5: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/pages', 'styles')],
  },
  exportPathMap: async (defaultPathMap) => {
    return defaultPathMap;
  },
  webpack: (config, props) => {
    const { isServer, webpack } = props;
    const entryOrigin = config.entry;
    // eslint-disable-next-line no-param-reassign
    config.entry = async (...args) => {
      const result = await entryOrigin(...args);
      // result['file-worker'] = './src/workers/file/index.worker.ts';
      return result;
    };
    config.plugins.push(new ReplaceInFileWebpackPlugin([{
      dir: './.next/static/chunks',
      test: /-worker\.js$/,
      rules: [{
        search: /\n\(self/,
        replace: () => {
          const webpackData = fs.readFileSync(path.join('./.next/static/chunks', 'webpack.js'), 'utf8');
          return `${webpackData}\n/*worker*/(self`;
        },
      }],
    }]));
    config.plugins.push(new CopyPlugin({
      patterns: [
        { from: './node_modules/inobounce/inobounce.min.js', to: './static/chunks/inobounce.js' },
        { from: './solidity/abis', to: './static/abis' },
        { from: './src/_data/whitepaper.pdf', to: './static/whitepaper.pdf' },
        { from: './src/_data/logo-512x512.png', to: './static/logo-512x512.png' },
        { from: './src/_data/logo-640x320.png', to: './static/logo-640x320.png' },
        { from: './src/_data/logo-1200x630.png', to: './static/logo-1200x630.png' },
        { from: './src/_data/logo-32x32.png', to: './static/logo-32x32.png' },
        { from: './src/locales/info.json', to: './static/chunks/locale-info.json' },
        ...locales.map((locale) => ({
          from: `./src/locales/${locale}/index.json`,
          to: `./static/chunks/locale-${locale}.json`,
        })),
      ],
    }));
    config.module.rules.unshift({
      test: /\.svg$/i,
      type: 'asset/source',
    });
    if (isServer) {
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /(workers|i18n)/,
        (resource) => {
          if (resource.request && resource.request.includes('workers/index')
            && !resource.request.includes('workers/index.server')) {
            // eslint-disable-next-line no-param-reassign
            resource.request = resource.request.replace('workers/index', 'workers/index.server');
          } else if (resource.request && /workers$/.test(resource.request)) {
            // eslint-disable-next-line no-param-reassign
            resource.request = resource.request.replace('workers', 'workers/index.server');
          }

          if (resource.request && resource.request.includes('i18n/index')
            && !resource.request.includes('i18n/index.server')) {
            // eslint-disable-next-line no-param-reassign
            resource.request = resource.request.replace('i18n/index', 'i18n/index.server');
          } else if (resource.request && /i18n$/.test(resource.request)) {
            // eslint-disable-next-line no-param-reassign
            resource.request = resource.request.replace('i18n', 'i18n/index.server');
          }
        },
      ));
    }
    return config;
  },
};
