import type { UserConfig } from 'vite'

export default {
  build: {
    outDir: '../docs',

    target: 'es6',

    cssMinify: false,
    sourcemap: false,
    emptyOutDir: true,
  },

  root: './src',
  base: '/wheel',

  css: {
    devSourcemap: false
  },

  server: {
    open: true
  }
} satisfies UserConfig;
