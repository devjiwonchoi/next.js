const esbuild = require('esbuild')
const babel = require('@babel/core')
module.exports = {
  process(src, filename) {
    const js = esbuild.transformSync(src, { loader: 'ts', format: 'cjs', target: 'node22', sourcefile: filename }).code
    return { code: babel.transformSync(js, { filename, plugins: [require('babel-plugin-jest-hoist')], babelrc: false, configFile: false }).code }
  },
}
