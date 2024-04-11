import { defineConfig } from "vite";
// import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /*
    visualizer({
      open: true, // Automatically open the report in your browser
      filename: "bundle-analysis.html",
    }),
    */
  ],
});
