import { processRatings } from './ratingProcessor'

let observer: MutationObserver | null = null

export const startObserver = (): void => {
  if (observer) return
  observer = new MutationObserver(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    processRatings()
    startObserver()
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
