const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - search results', () => {
  test('converts rating in search results', async () => {
    const dom = loadHTMLFile('search-results/Search - Rate Your Music.html')
    const elements = Array.from(
      dom.window.document.querySelectorAll('td[style*="width:100px"] span')
    )
    const element = elements.find((el) => {
      const style = el.getAttribute('style') || ''
      const text = el.textContent.trim()
      const num = parseFloat(text)
      return (
        style.includes('font-size:1.3em') &&
        style.includes('font-weight:bold') &&
        !isNaN(num) &&
        num >= 0.5 &&
        num <= 5.0
      )
    })

    await runContentScript(dom)

    const convertedValue = parseFloat(element.textContent.trim())
    expect(convertedValue).toBeGreaterThanOrEqual(1.0)
    expect(convertedValue).toBeLessThanOrEqual(10.0)
  })
})



