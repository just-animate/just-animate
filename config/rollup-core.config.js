import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  dest: 'dist/just-animate.js',
  entry: 'src/main.ts',
  format: 'iife',
  moduleName: 'just',
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
