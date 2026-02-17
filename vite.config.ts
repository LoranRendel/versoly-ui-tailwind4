import { defineConfig } from "vite";

const config = defineConfig({
  server: {
    port: 3005,
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
});

export default config;
