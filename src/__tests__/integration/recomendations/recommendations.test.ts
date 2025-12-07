import { loadHTMLFile, runContentScript } from '../test-helpers'

describe('content.js DOM manipulation - recommendations', () => {
  test('converts rating in component_discography_item_details_average_num', async () => {
    const dom = loadHTMLFile('Recommendations - Rate Your Music.html', __dirname)
    const elements = Array.from(
      dom.window.document.querySelectorAll('.component_discography_item_details_average_num')
    )
    const element = elements.find((el) => el.textContent?.trim() === '3.56')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('7.1')
  })

  test('converts rating in component_discography_item_details_average', async () => {
    const dom = loadHTMLFile('Recommendations - Rate Your Music.html', __dirname)
    const elements = Array.from(
      dom.window.document.querySelectorAll('.component_discography_item_details_average')
    )
    const element = elements.find((el) => el.textContent?.trim() === '3.56')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('7.1')
  })
})
