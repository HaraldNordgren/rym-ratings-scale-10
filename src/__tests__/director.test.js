const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - director', () => {
  test('converts disco_avg_rating elements from director page', async () => {
    const dom = loadHTMLFile('director/Francis Ford Coppola Filmography - Rate Your Music.html')
    const elements = Array.from(dom.window.document.querySelectorAll('.disco_avg_rating')).filter(
      (element) => {
        const text = element.textContent.trim()
        const num = parseFloat(text)
        return !isNaN(num) && num >= 0.5 && num <= 5.0
      }
    )

    expect(elements.length).toBeGreaterThan(0)

    const originalValues = elements.map((element) => {
      const span = element.querySelector('span.rating_not_enough_data')
      const targetElement = span || element
      return parseFloat(targetElement.textContent.trim())
    })

    await runContentScript(dom)

    elements.forEach((element, index) => {
      const span = element.querySelector('span.rating_not_enough_data')
      const targetElement = span || element
      const convertedText = targetElement.textContent.trim()
      const originalValue = originalValues[index]
      const expectedValue = (originalValue * 2).toFixed(1)
      expect(convertedText).toBe(expectedValue)
    })
  })

  test('converts all disco_avg_rating elements to 10-point scale', async () => {
    const dom = loadHTMLFile('director/Francis Ford Coppola Filmography - Rate Your Music.html')
    const elements = Array.from(dom.window.document.querySelectorAll('.disco_avg_rating'))

    await runContentScript(dom)

    elements.forEach((element) => {
      const span = element.querySelector('span.rating_not_enough_data')
      const targetElement = span || element
      const text = targetElement.textContent.trim()
      const value = parseFloat(text)

      if (!isNaN(value)) {
        expect(value).toBeGreaterThanOrEqual(1.0)
        expect(value).toBeLessThanOrEqual(10.0)
      }
    })
  })

  test('handles disco_avg_rating with rating_not_enough_data span', async () => {
    const dom = loadHTMLFile('director/Francis Ford Coppola Filmography - Rate Your Music.html')
    const elements = Array.from(dom.window.document.querySelectorAll('.disco_avg_rating')).filter(
      (element) => {
        return element.querySelector('span.rating_not_enough_data') !== null
      }
    )

    if (elements.length > 0) {
      const element = elements[0]
      const span = element.querySelector('span.rating_not_enough_data')
      const originalValue = parseFloat(span.textContent.trim())

      await runContentScript(dom)

      const convertedValue = parseFloat(span.textContent.trim())
      const expectedValue = (originalValue * 2).toFixed(1)
      expect(span.textContent.trim()).toBe(expectedValue)
      expect(convertedValue).toBeGreaterThanOrEqual(1.0)
      expect(convertedValue).toBeLessThanOrEqual(10.0)
    }
  })
})
