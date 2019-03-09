import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/web/_browser.ts',
  output: {
    file: 'dist/just-animate-web.js',
    format: 'iife',
    name: 'just',
  },
  plugins: [
    typescript({
      tsconfig: false,
      target: 'es5',
      rootDir: 'src',
      module: 'es2015',
      preserveConstEnums: false,
      removeComments: true,
      declaration: false,
      typescript: require('typescript'),
      noImplicitAny: true,
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json'],
      preferBuiltins: false,
    }),
  ],
};
