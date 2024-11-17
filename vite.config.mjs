import { defineConfig } from 'vite';
import { resolve } from 'path';
import viteSass from 'vite-plugin-sass';

export default defineConfig({
  root: resolve(__dirname, 'docs'),
  plugins: [viteSass()],
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'docs/index.html')
      }
    }
  },
  server: {
    open: true
  }
});
