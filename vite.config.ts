import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: false,
  build: {
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        entryFileNames: 'bundle.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (asset) =>
          asset.names.some((name) => name.endsWith('.css'))
            ? 'styles.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
  // Serve the same root folders in development and in the production artifact.
});
