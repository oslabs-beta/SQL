import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   // needed to add this in order for front end and back end to work together
  //   proxy: {
  //     '/': 'http://localhost:3000',
  //   },
  // },
});
