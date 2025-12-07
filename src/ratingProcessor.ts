import { processElement, processAttribute } from './elementProcessor'

const complexSelectors = [
  '.avg_rating',
  '.avg_rating_friends',
  '.page_charts_section_charts_item_details_average_num',
  '.disco_avg_rating',
  '.component_discography_item_details_average',
  '.component_discography_item_details_average_num',
  '[itemprop="ratingValue"]',
]

const simpleSelectors: [string, number][] = [
  ['#filmrating a.medium', 0],
  ['#musicrating a.medium', 0],
  ['[id^="film_cat_catalog_msg_"]', 0],
  ['.rating_num', 0],
  ['.page_artist_tracks_track_stats_rating', 1],
]

const processComplexRatings = (): void => {
  document.querySelectorAll(complexSelectors.join(', ')).forEach((element) => {
    const htmlElement = element as HTMLElement
    if (htmlElement.dataset.rymProcessed === 'true') return

    const ratingSpan = htmlElement.querySelector(
      'span.rating_not_enough_data'
    ) as HTMLElement | null
    processElement(ratingSpan || htmlElement)

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
}

const processSimpleRatings = (): void => {
  simpleSelectors.forEach(([selector, decimals]) => {
    document.querySelectorAll(selector).forEach((element) => {
      processElement(element as HTMLElement, decimals)
    })
  })
}

export const processRatings = (): void => {
  processComplexRatings()
  processSimpleRatings()

  if (document.documentElement.classList.contains('page_search')) {
    document.querySelectorAll('td[style*="width:100px"] span').forEach((element) => {
      processElement(element as HTMLElement)
    })
  }
}
