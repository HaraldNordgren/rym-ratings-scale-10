const convert = (value, decimals = 1) => {
  const number = parseFloat(value)
  if (isNaN(number) || !isFinite(number)) return value
  if (number < 0.5 || number > 5.0) return value
  return (number * 2).toFixed(decimals)
}

const update = (getValue, setValue, element, dataKey) => {
  if (element.dataset[dataKey] === 'processed') return
  
  const value = getValue()
  if (value) {
    const converted = convert(value)
    if (converted !== value) {
      setValue(converted)
      element.dataset[dataKey] = 'processed'
    }
  }
}

const processRatings = () => {
  document
    .querySelectorAll(
      '.avg_rating, .avg_rating_friends, .page_charts_section_charts_item_details_average_num, .disco_avg_rating, [itemprop="ratingValue"]'
    )
    .forEach((element) => {
      if (element.dataset.rymProcessed === 'true') return
      
      const ratingSpan = element.querySelector('span.rating_not_enough_data')
      const targetElement = ratingSpan || element

      update(
        () => {
          return targetElement.textContent.trim()
        },
        (value) => {
          targetElement.textContent = value
        },
        element,
        'rymTextProcessed'
      )

      if (element.classList.contains('avg_rating') || element.hasAttribute('itemprop')) {
        update(
          () => {
            return element.getAttribute('content')
          },
          (value) => {
            element.setAttribute('content', value)
          },
          element,
          'rymContentProcessed'
        )
      }

      if (element.classList.contains('review_rating')) {
        const image = element.querySelector('img')
        if (image) {
          ;['alt', 'title'].forEach((attribute) => {
            update(
              () => {
                return image.getAttribute(attribute)
              },
              (value) => {
                image.setAttribute(attribute, value)
              },
              element,
              `rym${attribute}Processed`
            )
          })
        }
      }
      
      element.dataset.rymProcessed = 'true'
    })

  document.querySelectorAll('#filmrating a.medium').forEach((element) => {
    if (element.dataset.rymProcessed === 'true') return
    
    const text = element.textContent.trim()
    const converted = convert(text, 1)
    if (converted !== text) {
      element.textContent = converted
      element.dataset.rymProcessed = 'true'
    }
  })

  if (document.documentElement.classList.contains('page_search')) {
    document.querySelectorAll('td[style*="width:100px"] span').forEach((element) => {
      if (element.dataset.rymProcessed === 'true') return
      
      const style = element.getAttribute('style') || ''
      if (style.includes('font-size:1.3em') && style.includes('font-weight:bold')) {
        const text = element.textContent.trim()
        const converted = convert(text, 1)
        if (converted !== text) {
          element.textContent = converted
          element.dataset.rymProcessed = 'true'
        }
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
