import typescript from 'rollup-plugin-typescript'
import nodeResolve from 'rollup-plugin-node-resolve'

module.exports = {
  entry: './src/just-animate-all.ts',
  dest: './dist/just-animate-all.js',
  format: 'iife',
  moduleName: 'just',
  plugins: [
    typescript({
      'tsconfig': false,
      'allowUnreachableCode': false,
      'allowUnusedLabels': false,
      'declaration': false,
      'forceConsistentCasingInFileNames': true,
      'inlineSourceMap': false,
      'module': 'es2015',
      'moduleResolution': 'node',
      'newLine': 'LF',
      'noEmit': true,
      'noFallthroughCasesInSwitch': true,
      'noImplicitAny': true,
      'noImplicitReturns': true,
      'noImplicitUseStrict': true,
      'noUnusedLocals': true,
      'preserveConstEnums': false,
      'removeComments': true,
      'rootDir': 'src',
      'sourceMap': false,
      'strictNullChecks': true,
      'suppressImplicitAnyIndexErrors': true,
      'target': 'es5',
      'typescript': require('typescript')
    }),
    nodeResolve({
      jsnext: false,
      main: false,
      browser: true,
      extensions: ['.ts', '.js', '.json' ],
      preferBuiltins: false
    })
  ]
}
