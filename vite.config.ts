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
