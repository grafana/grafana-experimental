let rules = [{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  include: /dist/, //Include dist folder as well to parse using babel loader in order to resolve exports not defined error
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    presets: [
      ["@babel/preset-env", {
        modules: "commonjs"
      }]
    ]
  }
}]

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.(stories|story).mdx',
    '../src/**/*.(stories|story).@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: config => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          {
            test: /node_modules\/monaco-editor/,
            use: {
              loader: 'babel-loader',
              options: { presets: ['@babel/preset-env'] }
            }
          },
          ...rules,
          ...config.module.rules
        ]
      },
      node: {
        fs: "empty"
      },
      plugins: [
        ...config.plugins,
        new CopyWebpackPlugin({
          patterns: [
            {
              context: path.join(require.resolve('monaco-editor/package.json'), '../min/vs/'),
              from: '**/*',
              to: 'public/lib/monaco/min/vs/',
              globOptions: {
                ignore: [
                  '**/*.map', // debug files
                ],
              },
            }
          ],
        })]
    }
  }
};
