const _ = require('lodash');
const gulp = require('gulp');
const simpleVars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const autoprefixer = require('autoprefixer');
const webpackStream = require('webpack-stream');
const livereload = require('gulp-livereload');
const path = require('path');
const webpack = require('webpack');
const errorHandler = require('./helpers/errorHandler');

const uiFolder = 'UI.Phantom';
const root = path.join(__dirname, '..', 'src');

console.log('ROOT:', root);

const config = {
  devtool: '#source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  entry: {
    preload: 'preload.js',
    vendor: 'vendor.js',
    index: 'index.js'
  },
  resolve: {
    root: [
      root,
      path.join(root, 'Shims'),
      path.join(root, 'JsLibraries')
    ],
    alias: {
      'backbone-pageable': 'JsLibraries/backbone.pageable',
      'backbone.deepmodel': 'Shims/backbone.deep.model',
      'backbone.sorted.collection': 'JsLibraries/backbone-sorted-collection',
      'radio': 'JsLibraries/backbone.radio',
      'backgrid.selectall': 'Shims/backbone.backgrid.selectall',
      'marionette': 'Shims/backbone.marionette',
      'momentRange': 'JsLibraries/moment-range'
    }
  },
  output: {
    filename: path.join('_output', uiFolder, '[name].js'),
    sourceMapFilename: path.join('_output', uiFolder, '[name].map')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ],
  resolveLoader: {
    modulesDirectories: [
      'node_modules',
      'gulp/webpack/'
    ]
  },
  eslint: {
    formatter: function(results) {
      return JSON.stringify(results);
    }
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|JsLibraries)/,
        loader: 'babel',
        query: {
          plugins: ['transform-class-properties'],
          presets: ['es2015', 'decorators-legacy', 'react', 'stage-2'],
          env: {
            development: {
              plugins: ['transform-react-jsx-source']
            }
          }
        }
      },

      // CSS Modules
      {
        test: /\.css$/,
        exclude: /(node_modules|globals.css)/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      },

      // Global styles
      {
        test: /\.css$/,
        include: /(node_modules|globals.css)/,
        loader: 'style!css-loader'
      },

      // Fonts
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10240&mimetype=application/font-woff&emitFile=false&name=Content/Fonts/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|eot?#iefix|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?emitFile=false&name=Content/Fonts/[name].[ext]'
      }
    ]
  },
  postcss: function (webpack) {
    return [
      simpleVars({
        variables: function () {
          const colors = require('../src/Styles/Variables/colors');
          const dimensions = require('../src/Styles/Variables/dimensions');
          const fonts = require('../src/Styles/Variables/fonts');
          const animations = require('../src/Styles/Variables/animations');

          return _.extend({}, colors, dimensions, fonts, animations);
        }
      }),
      nested(),
      autoprefixer({
        browsers: [
          'Chrome >= 30',
          'Firefox >= 30',
          'Safari >= 6',
          'Edge >= 12',
          'Explorer >= 10',
          'iOS >= 7',
          'Android >= 4.4'
        ]
      })
    ];
  }
};

gulp.task('webpack', () => {
  return gulp.src('index.js')
    .pipe(webpackStream(config))
    .pipe(gulp.dest(''));
});

gulp.task('webpackWatch', () => {
  config.watch = true;
  return gulp.src('')
    .pipe(webpackStream(config))
    .on('error', errorHandler)
    .pipe(gulp.dest(''))
    .pipe(livereload());
});
