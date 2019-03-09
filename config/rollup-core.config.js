import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/just-animate.js',
    name: 'just',
    format: 'iife',
  },
  plugins: [
    typescript({
      declaration: false,
      module: 'es2015',
      noImplicitAny: true,
      preserveConstEnums: false,
      removeComments: true,
      rootDir: 'src',
      target: 'es5',
      tsconfig: false,
      typescript: require('typescript'),
    }),
    nodeResolve({
      browser: true,
      extensions: ['.js', '.json'],
      jsnext: true,
      main: true,
      module: true,
      preferBuiltins: false,
    }),
  ],
};
