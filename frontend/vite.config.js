import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",   // Required to expose Vite outside the Docker container
    port: 5173,
    proxy: {
      // Forward /chat requests to the FastAPI backend
      "/chat": {
        target: process.env.VITE_API_URL || "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
})