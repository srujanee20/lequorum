import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '$components': path.resolve(__dirname, './src/components'),
      '$': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // Standardizes the dev server port
  },
  build: {
    outDir: 'dist', // Explicitly defines the default output directory for production builds
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@chakra-ui') || id.includes('@emotion')) 
              return 'chakra';
            if (id.includes('react/') || id.includes('react-dom/')) 
              return 'react';
            if (id.includes('@tanstack'))
              return 'router';
            if (id.includes('recharts'))
              return 'charting';
            return 'vendor';
          }
        }
      }
    }
  }
});
