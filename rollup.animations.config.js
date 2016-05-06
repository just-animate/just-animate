import typescript from 'rollup-plugin-typescript';

export default {
    entry: './src/just-animate-animations.ts',
    dest: './dist/browser/just-animate-animations.js',
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