import type { UserConfig } from 'vite'

export default {
  build: {
    outDir: '../docs',

    target: 'es6',

    cssMinify: false,
    sourcemap: false,
  },

  root: './src',
  publicDir: '../docs',
  assetsInclude: ['../docs/'],

  css: {
    devSourcemap: false
  },

  server: {
    open: true
  }
} satisfies UserConfig;
