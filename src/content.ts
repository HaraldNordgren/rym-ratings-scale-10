import { processRatings } from './ratingProcessor'

let observer: MutationObserver | null = null

const startObserver = (): void => {
  if (observer) {
    return
  }
  observer = new MutationObserver(() => {
    observer?.disconnect()
    observer = null
    processRatings()
    startObserver()
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

const init = (): void => {
  processRatings()
  startObserver()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
