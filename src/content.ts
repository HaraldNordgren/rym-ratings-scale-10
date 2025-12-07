import { processRatings } from './ratingProcessor'
import { startObserver } from './observer'

const init = (): void => {
  processRatings()
  startObserver()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
