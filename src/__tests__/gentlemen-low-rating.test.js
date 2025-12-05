const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - gentlemen low rating', () => {
  test('does not double convert ratings below 2.5 when processed multiple times', async () => {
    const dom = loadHTMLFile('gentlement-low-rating/Gentlemen (Film, Crime)_ Reviews, Ratings, Cast and Crew - Rate Your Music.html')
    const element = dom.window.document.querySelector('.avg_rating[itemprop="ratingValue"]')
    
    if (!element) {
      const newElement = dom.window.document.createElement('span')
      newElement.className = 'avg_rating'
      newElement.setAttribute('itemprop', 'ratingValue')
      newElement.textContent = '1.0'
      newElement.setAttribute('content', '1.0')
      dom.window.document.body.appendChild(newElement)
      element = newElement
    } else {
      element.textContent = '1.0'
      element.setAttribute('content', '1.0')
    }

    expect(element.textContent.trim()).toBe('1.0')
    expect(element.getAttribute('content')).toBe('1.0')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('2.0')
    expect(element.getAttribute('content')).toBe('2.0')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('2.0')
    expect(element.getAttribute('content')).toBe('2.0')
  })

  test('does not double convert rating 2.0 when processed multiple times', async () => {
    const dom = loadHTMLFile('gentlement-low-rating/Gentlemen (Film, Crime)_ Reviews, Ratings, Cast and Crew - Rate Your Music.html')
    let element = dom.window.document.querySelector('.avg_rating[itemprop="ratingValue"]')
    
    if (!element) {
      element = dom.window.document.createElement('span')
      element.className = 'avg_rating'
      element.setAttribute('itemprop', 'ratingValue')
      dom.window.document.body.appendChild(element)
    }
    
    element.textContent = '2.0'
    element.setAttribute('content', '2.0')

    await runContentScript(dom)

    const firstConversion = element.textContent.trim()
    expect(firstConversion).toBe('4.0')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('4.0')
    expect(element.getAttribute('content')).toBe('4.0')
  })

  test('does not double convert rating 2.4 when processed multiple times', async () => {
    const dom = loadHTMLFile('gentlement-low-rating/Gentlemen (Film, Crime)_ Reviews, Ratings, Cast and Crew - Rate Your Music.html')
    let element = dom.window.document.querySelector('.avg_rating[itemprop="ratingValue"]')
    
    if (!element) {
      element = dom.window.document.createElement('span')
      element.className = 'avg_rating'
      element.setAttribute('itemprop', 'ratingValue')
      dom.window.document.body.appendChild(element)
    }
    
    element.textContent = '2.4'
    element.setAttribute('content', '2.4')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('4.8')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('4.8')
    expect(element.getAttribute('content')).toBe('4.8')
  })
})
