import { marked } from "marked"

import "$/styles/index.css"
import doc from "./listing.md?raw"

const content = marked.parse(doc)
document.querySelector<HTMLDivElement>("#vite")!.innerHTML = content
