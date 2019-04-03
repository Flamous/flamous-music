function getElem (property) {
  return document.querySelector(`[property="og:${property}"]`)
}

let title = getElem('title')
let description = getElem('description')
let url = getElem('url')

export function setOGData (ogData) {
  ogData.title && title.setAttribute('content', ogData.title)
  ogData.description && description.setAttribute('content', ogData.description)
  ogData.url && url.setAttribute('content', ogData.url)
}
