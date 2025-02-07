import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove comment once we connect our frontend to our backend
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
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
