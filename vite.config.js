import mpaPlugin from "vite-plugin-mpa"
import postcssEnvFunction from "postcss-env-function"

const mpa = mpaPlugin.default

const cssEnvVars = {
  environmentVariables: {
    "--layout-screen-small": "44rem",
    "--layout-screen-medium": "60rem",
  },
}

export default {
  appType: "mpa",
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
  plugins: [mpa()],
}
