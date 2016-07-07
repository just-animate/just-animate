var typescript = require('rollup-plugin-typescript');

module.exports = {
    entry: './src/just-animate-core.ts',
    dest: './dist/browser/just-animate-core.js',
    format: 'iife',
    moduleName: 'Just',
    plugins: [
        typescript({
            "target": "es5",
            "rootDir": "src",
            "module": "es2015",
            "preserveConstEnums": false,
            "removeComments": true,
            "declaration": false
        })
    ]
};