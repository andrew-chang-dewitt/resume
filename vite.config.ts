import { resolve } from "path"
import postcssEnvFunction from "postcss-env-function"
import type { UserConfig } from "vite"

const cssEnvVars = {
  environmentVariables: {
    "--layout-screen-small": "44rem",
    "--layout-screen-medium": "60rem",
  },
}

export default {
  appType: "mpa",
  build: {
    outDir: resolve(__dirname, "./dist"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        listing: resolve(__dirname, "src/listing/index.html"),
        resume: resolve(__dirname, "src/resume/index.html"),
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
  resolve: {
    alias: {
      $: resolve(__dirname, "./src"),
    },
  },
  root: resolve(__dirname, "./src"),
} satisfies UserConfig
