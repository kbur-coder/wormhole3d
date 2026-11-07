import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  server: { host: true, open: true },
  build: { target: "es2022" }
});
