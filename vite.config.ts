import type { UserConfig } from 'vite';

const env = process.env.NODE_ENV || 'main';

export default {
  root: './src',
  base: '/wheel',

  build: {
    outDir: `../public/${env}`,
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
