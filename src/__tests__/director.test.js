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

  test('converts film_cat_catalog_msg rating from director page', async () => {
    const dom = loadHTMLFile('director/Francis Ford Coppola Filmography - Rate Your Music.html')
    const element = dom.window.document.querySelector('#film_cat_catalog_msg_58')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('10')
  })
})
