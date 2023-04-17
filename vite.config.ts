import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isPreviewMode = process.env.PREVIEW_MODE === "true"
  return defineConfig({
    envDir: "../../",
    root: "./src/ui",
    plugins: [react(), viteSingleFile()],
    server: {
      hmr: {
        overlay: false,
      },
    },
    build: {
      target: "esnext",
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
      cssCodeSplit: false,
      outDir: "../../dist",
      rollupOptions: {
        input: {
          main: isPreviewMode ? "./src/ui/iframe.html" : "./src/ui/index.html",
        },
        output: {
          // file: 'index.html',
          inlineDynamicImports: true,
        }
      },
    },
  })
}
