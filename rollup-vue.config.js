import typescript from 'rollup-plugin-typescript';

module.exports = {
    entry: './src/just-animate-vue.ts',
    dest: './dist/just-animate-vue.js',
    format: 'iife',
    moduleName: 'just',
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