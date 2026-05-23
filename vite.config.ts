import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Split systems into separate chunk
          if (id.includes('/systems/')) {
            return 'systems';
          }
          // Split pet data into separate chunk
          if (id.includes('petData')) {
            return 'pet-data';
          }
        },
      },
    },
  },
  server: {
    open: true,
  },
});