import { resolve } from "path"
// usage should be like:
// import staticMdPlugin from "./plugins/static-md"
import postcssEnvFunction from "postcss-env-function"
import type { UserConfig } from "vite"

const cssEnvVars = {
  environmentVariables: {
    "--layout-screen-small": "44rem",
    "--layout-screen-medium": "60rem",
  },
}

// usage should be like:
// const staticMd = staticMdPlugin({
//   dirs: [resolve(__dirname, "./src/pages")],
//   htmlTemplate: "./src/md/template.html",
// })

export default {
  appType: "mpa",
  build: {
    outDir: resolve(__dirname, "./dist"),
    rollupOptions: {
      // ideally, a solution will auto-generate these 
      // for every md pge
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
  // usage should be like:
  // plugins: [staticMd],
  resolve: {
    alias: {
      $: resolve(__dirname, "./src"),
    },
  },
  root: resolve(__dirname, "./src"),
} satisfies UserConfig
