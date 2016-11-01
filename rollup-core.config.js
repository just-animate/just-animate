var typescript = require('rollup-plugin-typescript');

module.exports = {
    entry: './src/just-animate-core.ts',
    dest: './dist/just-animate-core.js',
    format: 'iife',
    plugins: [
        typescript({
            target: "es5",
            rootDir: "src",
            module: "es2015",
            preserveConstEnums: false,
            removeComments: true,
            declaration: false,
            typescript: require('typescript'),
            noImplicitAny: true
        })
    ]
};