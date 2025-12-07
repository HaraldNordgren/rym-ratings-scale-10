import { convert } from './ratingConverter'

const processElement = (element: HTMLElement, decimals: number = 1): boolean => {
  if (element.dataset.rymProcessed === 'true') return false
  const text = element.textContent?.trim() || ''
  const converted = convert(text, decimals)
  if (converted !== text && converted !== null && converted !== undefined) {
    element.textContent = converted
    element.dataset.rymProcessed = 'true'
    return true
  }
  return false
}

const processAttribute = (
  element: HTMLElement,
  attribute: string,
  decimals: number = 1
): boolean => {
  const value = element.getAttribute(attribute)
  if (!value) return false
  const converted = convert(value, decimals)
  if (converted !== value && converted !== null && converted !== undefined) {
    element.setAttribute(attribute, converted)
    return true
  }
  return false
}

const processRatings = (): void => {
  document
    .querySelectorAll(
      '.avg_rating, ' +
        '.avg_rating_friends, ' +
        '.page_charts_section_charts_item_details_average_num, ' +
        '.disco_avg_rating, ' +
        '.component_discography_item_details_average, ' +
        '.component_discography_item_details_average_num, ' +
        '[itemprop="ratingValue"]'
    )
    .forEach((element) => {
      const htmlElement = element as HTMLElement
      if (htmlElement.dataset.rymProcessed === 'true') return

      const ratingSpan = htmlElement.querySelector(
        'span.rating_not_enough_data'
      ) as HTMLElement | null
      const targetElement = ratingSpan || htmlElement
      processElement(targetElement)

      if (htmlElement.classList.contains('avg_rating') || htmlElement.hasAttribute('itemprop')) {
        processAttribute(htmlElement, 'content')
      }

      if (htmlElement.classList.contains('review_rating')) {
        const image = htmlElement.querySelector('img')
        if (image) {
          processAttribute(image, 'alt')
          processAttribute(image, 'title')
        }
      }

      htmlElement.dataset.rymProcessed = 'true'
    })

  const simpleSelectors: [string, number][] = [
    ['#filmrating a.medium', 0],
    ['#musicrating a.medium', 0],
    ['[id^="film_cat_catalog_msg_"]', 0],
    ['.rating_num', 0],
    ['.page_artist_tracks_track_stats_rating', 1],
  ]

  simpleSelectors.forEach(([selector, decimals]) => {
    document.querySelectorAll(selector).forEach((element) => {
      processElement(element as HTMLElement, decimals)
    })
  })

  if (document.documentElement.classList.contains('page_search')) {
    document.querySelectorAll('td[style*="width:100px"] span').forEach((element) => {
      const htmlElement = element as HTMLElement
      const style = htmlElement.getAttribute('style') || ''
      if (style.includes('font-size:1.3em') && style.includes('font-weight:bold')) {
        processElement(htmlElement, 1)
      }
    })
  }
}

let observer: MutationObserver | null = null
const startObserver = (): void => {
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

const init = (): void => {
  processRatings()
  startObserver()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
