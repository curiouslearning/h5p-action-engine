const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015'
        }
      },
      {
        test: /\.css?$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.css', '.ts', '.js', '.json' ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './H5P.ActionEngine/'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/**.json',
          to: '[name][ext]'
        }
      ]
    })
  ]
};
