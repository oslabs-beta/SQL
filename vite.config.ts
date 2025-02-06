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
  },
});
