import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/just-animate-core.ts',
    dest: 'dist/just-animate-core.js',
    format: 'iife',
    moduleName: 'Just',
    plugins: [
        typescript({
            "target": "es5",
            "rootDir": "src",
            "module": "es2015",
            "preserveConstEnums": false,
            "removeComments": true
        })
    ]
};