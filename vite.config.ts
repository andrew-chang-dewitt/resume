import { resolve } from "path"
// usage should be like:
import postcssEnvFunction from "postcss-env-function"
import type { UserConfig } from "vite"
import staticMdPlugin from "vite-plugin-static-md"

const HTML_ROOT = resolve(__dirname, "src/pages")
const OUT_DIR = resolve(__dirname, "dist")
const SRC_ROOT = resolve(__dirname, "src")

const cssEnvVars = {
  environmentVariables: {
    "--layout-screen-small": "44rem",
    "--layout-screen-medium": "60rem",
  },
}

// usage should be like:
const staticMd = staticMdPlugin({
  // htmlTemplate: "./src/md/template.html",
  cssFile: resolve(SRC_ROOT, "styles/index.css"),
})

export default {
  appType: "mpa",
  build: {
    outDir: OUT_DIR,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/pages/index.html"),
      },
    },
  },
  css: {
    postcss: {
      map: true,
      plugins: [
        postcssEnvFunction({
          importFrom: [cssEnvVars],
        }),
      ],
    },
  },
  // usage should be like:
  plugins: [staticMd],
  resolve: {
    alias: {
      $: SRC_ROOT,
    },
  },
  root: HTML_ROOT,
} satisfies UserConfig
