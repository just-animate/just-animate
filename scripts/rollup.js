const nodeResolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript')
const uglify = require('rollup-plugin-uglify')
const uglifyEs = require('uglify-es')

// prettier-ignore
const config = ({
    input,
    name = 'ea',
    minify = false,
    target = 'es5'
}) => {
    const options = {
        input,
        name,
        exports: 'none',
        plugins: []
    }

    // add typescript compiler
    options.plugins.push(
        typescript({
            allowJs: true,
            tsconfig: false,
            target: 'es5',
            rootDir: 'src',
            module: 'es2015',
            preserveConstEnums: false,
            removeComments: true,
            declaration: false,
            typescript: require('typescript')
        })
    )

    // add node resolver
    options.plugins.push(
        nodeResolve({
            module: true,
            jsnext: true,
            main: true,
            browser: true,
            extensions: ['.js', '.json'],
            preferBuiltins: false
        })
    )

    if (minify) {
        // optional minify
        const minifyOptions = {
            "warnings": "verbose",
            "compress": {
                "collapse_vars": true,
                "comparisons": true,
                "conditionals": true,
                "dead_code": true,
                "drop_console": true,
                "evaluate": false,
                "if_return": true,
                "inline": true,
                "reduce_vars": true,
                "loops": true,
                "passes": 3,
                "unsafe_comps": true,
                "typeofs": false
            },
            "output": {
                "semicolons": false
            },
            "toplevel": false,
            "ie8": false
        }
        options.plugins.push(uglify(minifyOptions, uglifyEs.minify))
    }

    return options
}

/** handles writing out statuses and writing bundle */
const write = (bundle, options) => {
    return bundle.write(options).then(
        r => console.log('\u2713 ' + options.file),
        e => {
            console.error('X ' + options.file + ': ' + JSON.stringify(e))
        }
    )
}

// core bundle
rollup.rollup(config({ input: 'src/index.ts' })).then(bundle => {
    write(bundle, {
        name: 'JA',
        file: 'dist/just-animate.js',
        format: 'iife'
    })
})

// core minified bundle
rollup.rollup(config({ input: 'src/index.ts', minify: true })).then(bundle => {
    write(bundle, {
        name: 'JA',
        file: 'dist/just-animate.min.js',
        format: 'iife'
    })
})