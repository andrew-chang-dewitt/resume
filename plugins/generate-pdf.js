import path from "path"
import { promises } from "fs"
import puppeteer from "puppeteer"

const __dirname = import.meta.dirname
const { writeFile } = promises

const retry = (fn, ms, max) =>
  new Promise((resolve) => {
    fn()
      .then(resolve)
      .catch((e) => {
        console.error(`error encountered in ${fn}`)
        console.dir(e)

        if (max > 0) {
          setTimeout(() => {
            console.log("retrying...")
            retry(fn, ms, max - 1).then(resolve)
          }, ms)
        } else {
          console.log("max retries reached")
        }
      })
  })

const getPDF = async (url) => {
  console.info(
    `WARNING: This script creates a pdf of the version currently hosted live at
  ${url}. Make sure any changes have been pushed to live before generating
  the PDF.`,
  )

  console.debug("Launching puppeteer browser...")
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-gpu", "--no-sandbox"],
  })
  console.debug("Browser launched.")
  console.debug("Creating new page...")
  const page = await browser.newPage()
  console.debug("Page created.")

  console.debug(`Page navigating to: '${url}' ...`)
  await retry(async () => {
    await page.goto(url, { waitUntil: "networkidle2" })
  }, 1000, 10)
  console.debug("Page navigated.")
  console.debug(`Printing page as pdf...`)
  const pdf = await page.pdf({
    format: "Letter",
    // margin: {
    //   top: "0.3 in",
    //   bottom: "0.2 in",
    //   right: "0.3 in",
    //   left: "0.3 in",
    // },
  })
  console.debug("Page printed.")

  await browser.close()

  return pdf
}

const saveFile = async (file, path_name) => {
  const filePath = path.join(__dirname, "../" + path_name)

  try {
    console.info(`Writing pdf to '${filePath}' ...`)
    await writeFile(filePath, file)
  } catch (err) {
    console.error(`Error encountered while writing file to '${filePath}'.`)
    throw err
  }

  console.info("File written succesfully.")

  return true
}

const main = async () => {
  const url = process.argv[2]
  const path_name = process.argv[3]
  const pdf = await getPDF(url)
  await saveFile(pdf, path_name)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
