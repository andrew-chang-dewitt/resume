import { marked } from "marked"

import "./styles/index.css"
import resumeDoc from "./resume.md?raw"
import listingDoc from "./job-listing.md?raw"

const resume = marked.parse(resumeDoc)
const listing = marked.parse(listingDoc)
document.querySelector<HTMLDivElement>("#vite")!.innerHTML =
  listing + "<br /><br /><br />" + resume
