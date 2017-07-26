// Karma configuration
// Generated on Fri Jun 23 2017 21:13:04 GMT-0400 (EDT)


module.exports = function (config) {

    var configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // customLaunchers: {
        //     Chrome_travis_ci: {
        //         base: 'Chrome',
        //         flags: ['--no-sandbox']
        //     }
        // },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', "karma-typescript"],
        modules: [
            // 'just-curves'
        ],


        // list of files / patterns to load in the browser
        files: [
            'tests/**/*.ts',
            'src/**/*.ts',
            // 'node_modules/just-curves/**/*.ts'
        ],


        // list of files to exclude
        exclude: [
            'src/web/_browser.ts'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.ts': ["karma-typescript"]
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        specReporter: {
            suppressFailed: false,      // do not print information about failed tests 
            suppressPassed: false,      // do not print information about passed tests 
            suppressSkipped: true,      // do not print information about skipped tests 
            showSpecTiming: false,      // print the time elapsed for each spec
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

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        typescript: {
            tsconfig: "./tsconfig.json",
            compilerOptions: {
                module: "commonjs",
                noImplicitAny: true,
                outDir: "tmp",
                target: "ES5",
                sourceMap: true,
                allowJs: true,
                types: [
                    "mocha",
                    "expect.js"
                ]
            },
            transformPath: function (filepath) {
                return filepath.replace(/\.(ts)$/, ".js");
            },
            exclude: [
                'node_modules'
            ]
        }
    }
    configuration.browsers.push(
        'Firefox'
    )

    if (process.env.TRAVIS) {
        configuration.singleRun = true
        
    } else {
        configuration.singleRun = false 
    }

    config.set(configuration)
}
