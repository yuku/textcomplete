const SUPPORTED_BROWSERS = [
  'Chrome',
  'Edge',
  'Firefox',
  'IE',
  'Opera',
  'Safari',
];

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'detectBrowsers'],
    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html'
      }
    },
    // list of files / patterns to load in the browser
    files: [
      'test/**/*_spec.js'
    ],
    // list of files to exclude
    exclude: [
      'src/doc/*.js'
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-detect-browsers',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-mocha',
      'karma-opera-launcher',
      'karma-safari-launcher',
      'karma-webpack'
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/*.js': 'webpack',
      'test/**/*_spec.js': 'webpack'
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcov' },
        { type: 'text' },
      ],
    },
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
          },
        ],
      },
    },

    detectBrowsers: {
      usePhantomJS: false,
      postDetection: (browsers) => {
        if (process.env.TRAVIS) {
          // TODO: Test with Chrome
          return ['Firefox'];
        } else {
          return browsers.filter(browser => SUPPORTED_BROWSERS.indexOf(browser) !== -1);
        }
      }
    },
  })
}
