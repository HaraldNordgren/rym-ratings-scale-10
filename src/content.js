const convert = (value, decimals = 1) => {
  const number = parseFloat(value)
  if (isNaN(number) || !isFinite(number)) return value
  if (number < 0.5 || number > 5.0) return value
  return (number * 2).toFixed(decimals)
}

const processElement = (element, decimals = 1) => {
  if (element.dataset.rymProcessed === 'true') return false
  const text = element.textContent.trim()
  const converted = convert(text, decimals)
  if (converted !== text) {
    element.textContent = converted
    element.dataset.rymProcessed = 'true'
    return true
  }
  return false
}

const processAttribute = (element, attribute, decimals = 1) => {
  const value = element.getAttribute(attribute)
  if (!value) return false
  const converted = convert(value, decimals)
  if (converted !== value) {
    element.setAttribute(attribute, converted)
    return true
  }
  return false
}

const processRatings = () => {
  document
    .querySelectorAll(
      '.avg_rating, .avg_rating_friends, .page_charts_section_charts_item_details_average_num, .disco_avg_rating, .component_discography_item_details_average, .component_discography_item_details_average_num, [itemprop="ratingValue"]'
    )
    .forEach((element) => {
      if (element.dataset.rymProcessed === 'true') return

      const ratingSpan = element.querySelector('span.rating_not_enough_data')
      const targetElement = ratingSpan || element
      processElement(targetElement)

      if (element.classList.contains('avg_rating') || element.hasAttribute('itemprop')) {
        processAttribute(element, 'content')
      }

      if (element.classList.contains('review_rating')) {
        const image = element.querySelector('img')
        if (image) {
          processAttribute(image, 'alt')
          processAttribute(image, 'title')
        }
      }

      element.dataset.rymProcessed = 'true'
    })

  const simpleSelectors = [
    ['#filmrating a.medium', 0],
    ['#musicrating a.medium', 0],
    ['[id^="film_cat_catalog_msg_"]', 0],
    ['.rating_num', 0],
    ['.page_artist_tracks_track_stats_rating', 1]
  ]

  simpleSelectors.forEach(([selector, decimals]) => {
    document.querySelectorAll(selector).forEach((element) => {
      processElement(element, decimals)
    })
  })

  if (document.documentElement.classList.contains('page_search')) {
    document.querySelectorAll('td[style*="width:100px"] span').forEach((element) => {
      const style = element.getAttribute('style') || ''
      if (style.includes('font-size:1.3em') && style.includes('font-weight:bold')) {
        processElement(element, 1)
      }
    })
  }
}

let observer = null
const startObserver = () => {
  if (observer) return
  observer = new MutationObserver(() => {
    observer.disconnect()
    observer = null
    processRatings()
    startObserver()
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

const init = () => {
  processRatings()
  startObserver()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
