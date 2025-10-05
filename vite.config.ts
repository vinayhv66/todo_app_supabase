// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the plugin

export default defineConfig({
  base: './', // use relative asset paths so /assets/... doesn't 404 in static hosting
  plugins: [
    react(),
    tailwindcss(), // Add the Tailwind CSS plugin
  ],
});