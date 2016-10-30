var typescript = require('rollup-plugin-typescript');

module.exports = {
    entry: './src/index.ts',
    dest: './dist/index.js',
    format: 'cjs',
    plugins: [
        typescript({
            target: "es5",
            rootDir: "src",
            module: "es2015",
            declaration: true,
            preserveConstEnums: false,
            removeComments: true,
            declaration: true,
            typescript: require('typescript'),
            noImplicitAny: true,
            inlineSourceMap: false,
            sourceMap: false
        })
    ]
};