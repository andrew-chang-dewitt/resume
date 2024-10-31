import postcssEnvFunction from "postcss-env-function"

const cssEnvVars = {
  environmentVariables: {
    "--layout-screen-small": "44rem",
    "--layout-screen-medium": "60rem",
  },
}

export default {
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
}
