import type { UserConfig } from 'vite';

const outDir: string = `../${process.env.OUT_DIR}` || '../docs/local';

export default {
  root: './src',
  base: '/wheel',

  build: {
    outDir: outDir,

    target: 'es6',

    cssMinify: false,
    sourcemap: false,
    emptyOutDir: true,
  },

  css: {
    devSourcemap: false
  },

  server: {
    open: true
  }
} satisfies UserConfig
