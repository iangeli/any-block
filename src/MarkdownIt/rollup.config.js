//import resolve from '@rollup/plugin-node-resolve'
//import terser from '@rollup/plugin-terser'
//import { babel } from '@rollup/plugin-babel'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(new URL('package.json', import.meta.url)))

function globalName (name) {
  const parts = name.split('-')
  for (let i = 2; i < parts.length; i++) {
    parts[i] = parts[i][0].toUpperCase() + parts[i].slice(1)
  }
  return parts.join('')
}

const config_umd_full = {
  input: 'index.ts',
  output: [
    {
      file: `dist/mdit-any-block.js`,
      format: 'umd',
      name: 'mdit-any-block',
      plugins: []
    },
    {
      file: `dist/mdit-any-block.min.js`,
      format: 'umd',
      name: 'mdit-any-block',
      plugins: []
    }
  ],
  plugins: []
}

const config_cjs_no_deps = {
  input: 'index.ts',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs'
  },
  external: ['markdown-it', 'jsdom'], // Object.keys(pkg.dependencies || {}),
  plugins: []
}

let config = [
  config_umd_full,
  config_cjs_no_deps
]

if (process.env.CJS_ONLY) config = [config_cjs_no_deps]

export default config
