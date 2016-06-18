import path from 'path';
import webpack from 'webpack';

process.env.BABEL_ENV = 'browser';

function config({production}) {
  return {
    devtool: production ? 'hidden-source-map' : 'source-map',
    entry: './src/index.js',
    target: 'web',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'whitestorm.js',
      library: 'WHS',
      libraryTarget: 'var'
    },
    module: {
      preLoaders: [
        {
          test: /physi\.js$/,
          loader: 'string-replace',
          query: {
            multiple: [
              {
                search: 'from \'inline-worker\';',
                replace: 'from \'webworkify-webpack\';'
              },
              {
                search: 'new Worker(require(\'./worker.js\'));',
                replace: 'Worker(require(\'./worker.js\'));'
              }
            ]
          }
        }
      ],
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        }
      ]
    },
    plugins: production
      ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          mangle: false,
          compress: {
            warnings: false
          }
        }),
        new webpack.ProvidePlugin({
          THREE: 'three'
        })
      ]
      : []
  };
}

export {
  config as default
};
