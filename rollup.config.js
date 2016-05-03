import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';

export default {
    entry: 'src/browser.ts',
    dest: 'dist/just-animate.js',
    format: 'iife',
    plugins: [
        typescript({
            "target": "es6",
            "rootDir": "src",
            "module": "es2015",
            "preserveConstEnums": false,
            "removeComments": true
        }),
        json({
            exclude: [ 'node_modules/']
        })
    ]
};