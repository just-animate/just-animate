var typescript = require('rollup-plugin-typescript');

module.exports = {
    entry: './src/just-animate-all.ts',
    dest: './dist/just-animate-all.js',
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