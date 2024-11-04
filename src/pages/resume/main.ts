import { marked } from "marked"

import "../shared/styles/index.css"
import doc from "./resume.md?raw"

const content = marked.parse(doc)
document.querySelector<HTMLDivElement>("#vite")!.innerHTML = content
