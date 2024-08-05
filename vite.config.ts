import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  resolve: {
    alias: {
      // @ts-ignore
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ["path", "fs"],
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
});
