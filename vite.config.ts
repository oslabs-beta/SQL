import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove comment once we connect our frontend to our backend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '^/jaeger/api/traces': {         // Specifically match Jaeger trace requests
        target: 'http://localhost:16686',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jaeger/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received response from:', req.url);
          });
        }
      }
    },
    // Add settings to help with debugging
    host: true,
    port: 5173,
    strictPort: true,
    open: true
  },
  // Add logging
  logLevel: 'info',
  clearScreen: false
});
