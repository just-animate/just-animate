import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

module.exports = {
  entry: './src/index.ts',
  dest: './dist/index.js',
  format: 'cjs',
  plugins: [
    typescript({
      target: 'es5',
      rootDir: 'src',
      module: 'es2015',
      declaration: true,
      preserveConstEnums: false,
      removeComments: true,
      typescript: require('typescript'),
      noImplicitAny: true,
      inlineSourceMap: false,
      sourceMap: false
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: false
    })
  ]
}
