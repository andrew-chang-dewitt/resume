import { JSDOM } from "jsdom"
import { marked } from "marked"
import { parse } from "node:path"
import { readdir, readFile, stat, writeFile } from "node:fs/promises"
import { resolve } from "path"
import type { Plugin } from "vite"
import { createServer } from "vite"

export interface Options {
  srcDir: string
  htmlTemplate: string
  outDir?: string
}

export default function staticMd(opts: Options): Plugin[] {
  return [
    {
      name: "static-md-plugin:build",
      apply: "build",
      enforce: "pre",

      configResolved(config) {
        if (!opts.outDir) {
          opts.outDir = config.build.outDir
        }
      },
      // TODO: is it possible to use just paths and/or pages (below) to actually
      // just get a list of where md files are, then edit the config to resolve
      // the contained uris to their matching `<path/to/source/file>.md` and
      // then use a transform hook to turn any md code modules to their resulting
      // html files/code modules?
      //
      // if this ^ approach works, it feels much more in line w/ how vite/rollup
      // are supposed to work

      async writeBundle() {
        //   1. get all md files
        const paths = await getPaths(opts.srcDir)
        //   2. parse and convert to html strings
        const pages = await buildPages(paths, opts.srcDir)
        //   3. write each string to html using opts.htmlTemplate
        Object.keys(pages).forEach((page) => makeFile(pages[page], opts))
        // for later: build sitemap from these files
      },
      // transformIndexHtml(_html) {
      //   // write `transform` hook that
      //   //   - if in dev mode, simply returns html as is
      //   //   - if in build mode, processes markdown dir files, sorting by
      //   //     date & applying filters? then subs generated html for
      //   //     actual page in tree?
      // },
    },

    {
      name: "static-md-plugin:serve",
      apply: "serve",
      enforce: "pre",

      async configureServer(server) {
        // first, get all markdown files to turn into pages as in build
        const paths = await getPaths(opts.srcDir)
        // and make pages from each as before
        const pages = await buildPages(paths, opts.srcDir)
        // then get html template for use in building pages on demand
        const htmlTemplate = await readFile(opts.htmlTemplate, {
          encoding: "utf8",
        })

        // function reloadPage() {
        //   return () => {
        //     server.middlewares.use(async (req, res, next) => {
        //       if ()
        //     })
        //   }
        // }
      },
    },
  ]
}

async function getPaths(dir: string): Promise<string[]> {
  let paths: string[] = []

  const files = await readdir(dir)

  for (const file in files) {
    const isDir = await stat(file).then((s) => s.isDirectory())

    if (isDir) {
      // if file is directory, recur
      paths = [...paths, ...(await getPaths(file))]
    } else if (parse(file).ext === "md") {
      // if file is markdown, add to results
      paths.push(resolve(dir, file))
    } // otherwise, ignore file
  }

  return paths
}

interface Page {
  filename: string
  uri: string
  html: string
}

async function buildPages(
  paths: string[],
  fromDir: string,
): Promise<Record<string, Page>> {
  const pages = await Promise.all(paths.map((path) => buildPage(path, fromDir)))

  return pages.reduce((ret, page) => {
    return {
      ...ret,
      [page.uri]: page,
    }
  }, {})
}

async function buildPage(path: string, fromDir: string): Promise<Page> {
  const fileContents = await readFile(path, { encoding: "utf8" })

  return {
    filename: path,
    uri: getRelativeURI(path, fromDir),
    html: await marked(fileContents),
  }
}

function getRelativeURI(fqn: string, fromPre: string): string {
  if (fqn.startsWith(fromPre)) {
    return fqn.slice(fromPre.length)
  }

  return fqn
}

async function makeFile(page: Page, { outDir, htmlTemplate }: Options) {
  const outPath = resolve(outDir, page.uri)
  const html = await readFile(htmlTemplate, { encoding: "utf8" })
  const outContents = transformPage(page, html)

  await writeFile(outPath, outContents, { encoding: "utf8" })
}

function transformPage(page: Page, html: string): string {
  const DOM = new JSDOM(html)
  const document = DOM.window.document
  const targetNode = document.querySelector("template#markdown-target")
  targetNode.innerHTML = page.html

  return "<!DOCTYPE html>" + document.documentElement.outerHTML
}
