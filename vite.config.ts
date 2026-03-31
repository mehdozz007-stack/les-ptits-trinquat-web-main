import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "::",
    port: 8082,

    fs: {
      allow: ["."],
    },

    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "@tanstack/react-query"
    ],
  },

  build: {
    chunkSizeWarningLimit: 800,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk séparé
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // UI components séparé
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
          ],
          // Animations séparé
          animations: [
            'framer-motion',
          ],
          // Query client séparé
          query: [
            '@tanstack/react-query',
          ],
        },
      },
    },
  },
});
