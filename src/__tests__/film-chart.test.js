const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - film-chart', () => {
  test('converts chart page average_num from custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html')
    const element = dom.window.document.querySelector(
      '.page_charts_section_charts_item_details_average_num'
    )
    const originalValue = element.textContent.trim()

    await runContentScript(dom)

    const convertedValue = element.textContent.trim()
    if (parseFloat(originalValue) >= 0.5 && parseFloat(originalValue) <= 5.0) {
      const expectedValue = (parseFloat(originalValue) * 2).toFixed(1)
      expect(convertedValue).toBe(expectedValue)
    }
  })

  test('converts multiple chart page ratings from custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html')
    const elements = Array.from(
      dom.window.document.querySelectorAll('.page_charts_section_charts_item_details_average_num')
    ).slice(0, 3)
    const originalValues = elements.map((el) => el.textContent.trim())

    await runContentScript(dom)

    elements.forEach((element, index) => {
      const convertedValue = element.textContent.trim()
      const originalValue = originalValues[index]
      if (parseFloat(originalValue) >= 0.5 && parseFloat(originalValue) <= 5.0) {
        const expectedValue = (parseFloat(originalValue) * 2).toFixed(1)
        expect(convertedValue).toBe(expectedValue)
      }
    })
  })

  test('converts all chart page ratings in custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html')
    const elements = dom.window.document.querySelectorAll(
      '.page_charts_section_charts_item_details_average_num'
    )

    await runContentScript(dom)

    elements.forEach((element) => {
      const value = parseFloat(element.textContent.trim())
      expect(value).toBeGreaterThanOrEqual(1.0)
      expect(value).toBeLessThanOrEqual(10.0)
    })
  })
})
