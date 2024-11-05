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
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        listing: resolve(__dirname, "src/listing/index.html"),
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
}
