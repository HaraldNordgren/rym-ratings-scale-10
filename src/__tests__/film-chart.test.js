const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - film-chart', () => {
  test('converts chart page average_num from custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html')
    const elements = Array.from(
      dom.window.document.querySelectorAll('.page_charts_section_charts_item_details_average_num')
    )
    const element = elements.find((el) => el.textContent.trim() === '3.94')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('7.9')
  })
})
