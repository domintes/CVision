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
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  }
});
