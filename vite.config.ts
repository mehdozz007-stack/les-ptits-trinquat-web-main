import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Permet à Vite de servir les fichiers du dossier public
      allow: ["."],
    },
    // Proxy désactivé - utilise l'API_BASE_URL dynamique de api-config.ts
    // Pour utiliser le serveur local Cloudflare, lance: cd cloudflare && npx wrangler dev
    // Puis décommente le proxy ci-dessous:
    /*
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
    */
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les dépendances de taille importante
          "vendor-ui": ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          "vendor-motion": ["framer-motion"],
          "vendor-form": ["@tanstack/react-query"],
          // Séparer les pages par route
          "page-index": ["./src/pages/Index.tsx"],
          "page-events": ["./src/pages/Evenements.tsx"],
          "page-partenaires": ["./src/pages/Partenaires.tsx"],
        },
      },
    },
  },
}));
