import size from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript';
import uglifyOptions from './compress.json';
import { minify } from 'uglify-js';
import { uglify } from 'rollup-plugin-uglify';

export default args => {
  const config = {
    input: 'src/main.ts',
    output: [{ file: 'dist/just-animate-umd.js', name: 'just', format: 'umd' }],
    plugins: [
      typescript({
        declaration: false,
        module: 'es2015',
        noImplicitAny: true,
        preserveConstEnums: false,
        removeComments: false,
        rootDir: 'src',
        target: 'es5',
        tsconfig: false,
        typescript: require('typescript'),
      }),
    ],
  };

  // If production build, check size and compress.
  if (!args.configDebug) {
    config.output[0].file = 'dist/just-animate-umd.min.js';
    config.plugins.push(uglify(uglifyOptions, minify), size());
  }

  return config;
};
