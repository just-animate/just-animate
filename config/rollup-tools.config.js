import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

module.exports = {
  entry: 'src/tools/index.ts',
  dest: 'dist/just-animate-tools.js',
  format: 'iife',
  moduleName: 'just.tools',
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
      noImplicitAny: true
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json'],
      preferBuiltins: false
    })
  ]
}
