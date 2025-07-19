import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // form-frontend/vite.config.js
  server: {
    proxy: {
      // Proxy API requests to your Laravel backend
      "/api": {
        target: "https://form-backend.test",
        changeOrigin: true,
        secure: false, // Important for self-signed certs from Herd
      },
      // Also proxy the Sanctum CSRF cookie route
      "/sanctum": {
        target: "https://form-backend.test",
        changeOrigin: true,
        secure: false,
      },

      "/storage": {
        target: "https://form-backend.test",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
