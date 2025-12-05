const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - director', () => {
  test('converts disco_avg_rating from director page', async () => {
    const dom = loadHTMLFile('director/Francis Ford Coppola Filmography - Rate Your Music.html')
    const elements = Array.from(dom.window.document.querySelectorAll('.disco_avg_rating'))
    const element = elements.find((el) => {
      const span = el.querySelector('span.rating_not_enough_data')
      const targetElement = span || el
      return targetElement.textContent.trim() === '1.61'
    })

    await runContentScript(dom)

    const span = element.querySelector('span.rating_not_enough_data')
    const targetElement = span || element
    expect(targetElement.textContent.trim()).toBe('3.2')
  })
})
