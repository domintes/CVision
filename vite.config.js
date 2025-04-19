import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'jotai'],
          'pdf': ['html2pdf.js']
        }
      }
    }
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  }
});
