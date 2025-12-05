const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - recommendations', () => {
  test('converts numeric ratings in recommendations page', async () => {
    const dom = loadHTMLFile('recomendations/Recommendations - Rate Your Music.html')
    const ratingElements = Array.from(
      dom.window.document.querySelectorAll(
        '.component_discography_item_details_average, .component_discography_item_details_average_num'
      )
    ).filter((element) => {
      const text = element.textContent.trim()
      const num = parseFloat(text)
      return !isNaN(num) && num >= 0.5 && num <= 5.0
    })

    expect(ratingElements.length).toBeGreaterThan(0)

    const originalValues = ratingElements.map((element) =>
      parseFloat(element.textContent.trim())
    )

    await runContentScript(dom)

    ratingElements.forEach((element, index) => {
      const convertedText = element.textContent.trim()
      const originalValue = originalValues[index]
      const expectedValue = (originalValue * 2).toFixed(1)
      expect(convertedText).toBe(expectedValue)
    })
  })

  test('converts all numeric ratings in recommendations page to 0-10 scale', async () => {
    const dom = loadHTMLFile('recomendations/Recommendations - Rate Your Music.html')
    const ratingElements = Array.from(
      dom.window.document.querySelectorAll(
        '.component_discography_item_details_average, .component_discography_item_details_average_num'
      )
    ).filter((element) => {
      const text = element.textContent.trim()
      const num = parseFloat(text)
      return !isNaN(num) && num >= 0.5 && num <= 5.0
    })

    await runContentScript(dom)

    ratingElements.forEach((element) => {
      const text = element.textContent.trim()
      const value = parseFloat(text)
      expect(value).toBeGreaterThanOrEqual(1.0)
      expect(value).toBeLessThanOrEqual(10.0)
    })
  })
})
