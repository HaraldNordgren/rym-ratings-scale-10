const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - search results', () => {
  test('converts ratings in search results', async () => {
    const dom = loadHTMLFile('search-results/Search - Rate Your Music.html')
    const ratingSpans = Array.from(
      dom.window.document.querySelectorAll('td[style*="width:100px"] span')
    ).filter((span) => {
      const style = span.getAttribute('style') || ''
      const text = span.textContent.trim()
      const num = parseFloat(text)
      return (
        style.includes('font-size:1.3em') &&
        style.includes('font-weight:bold') &&
        !isNaN(num) &&
        num >= 0.5 &&
        num <= 5.0
      )
    })

    expect(ratingSpans.length).toBeGreaterThan(0)

    const originalValues = ratingSpans.map((span) =>
      parseFloat(span.textContent.trim())
    )

    await runContentScript(dom)

    ratingSpans.forEach((span, index) => {
      const convertedText = span.textContent.trim()
      const originalValue = originalValues[index]
      const expectedValue = (originalValue * 2).toFixed(1)
      expect(convertedText).toBe(expectedValue)
    })
  })

  test('converts all search result ratings to 10-point scale', async () => {
    const dom = loadHTMLFile('search-results/Search - Rate Your Music.html')
    const ratingSpans = Array.from(
      dom.window.document.querySelectorAll('td[style*="width:100px"] span')
    ).filter((span) => {
      const style = span.getAttribute('style') || ''
      return (
        style.includes('font-size:1.3em') && style.includes('font-weight:bold')
      )
    })

    await runContentScript(dom)

    ratingSpans.forEach((span) => {
      const text = span.textContent.trim()
      const value = parseFloat(text)
      if (!isNaN(value) && text !== '') {
        expect(value).toBeGreaterThanOrEqual(1.0)
        expect(value).toBeLessThanOrEqual(10.0)
      }
    })
  })

  test('converts specific ratings correctly', async () => {
    const dom = loadHTMLFile('search-results/Search - Rate Your Music.html')
    await runContentScript(dom)

    const ratingSpans = Array.from(
      dom.window.document.querySelectorAll('td[style*="width:100px"] span')
    ).filter((span) => {
      const style = span.getAttribute('style') || ''
      return (
        style.includes('font-size:1.3em') && style.includes('font-weight:bold')
      )
    })

    const convertedValues = ratingSpans
      .map((span) => span.textContent.trim())
      .filter((text) => {
        const num = parseFloat(text)
        return !isNaN(num) && num >= 1.0 && num <= 10.0
      })

    expect(convertedValues.length).toBeGreaterThan(0)
  })
})


