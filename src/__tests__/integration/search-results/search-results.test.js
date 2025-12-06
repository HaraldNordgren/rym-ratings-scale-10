const { loadHTMLFile, runContentScript } = require('../test-helpers')

describe('content.js DOM manipulation - search results', () => {
  test('converts rating in search results', async () => {
    const dom = loadHTMLFile('Search - Rate Your Music.html')
    const elements = Array.from(
      dom.window.document.querySelectorAll('td[style*="width:100px"] span')
    )
    const element = elements.find((el) => {
      const style = el.getAttribute('style') || ''
      return (
        style.includes('font-size:1.3em') &&
        style.includes('font-weight:bold') &&
        el.textContent.trim() === '3.71'
      )
    })

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('7.4')
  })
})
