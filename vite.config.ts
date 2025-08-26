import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),    
    ],
    define: {
      "process.env": env,
      'import.meta.env.VITE_GMAPS_API_KEY': JSON.stringify('AIzaSyBHlJ9KQFnRZMz5jV6bZh-OQuS9iw16kGA')
    },

    server: {
      port: 5173,
        allowedHosts: [""],
        proxy: {
          '/api': {
            target: 'https://prtest.hellomepay.online/',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path
          },
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});