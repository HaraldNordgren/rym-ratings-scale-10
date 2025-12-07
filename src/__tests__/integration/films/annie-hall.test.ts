import { loadHTMLFile, runContentScript } from '../test-helpers'

describe('content.js DOM manipulation - annie-hall', () => {
  test('converts avg_rating from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall.html')
    const element = dom.window.document.querySelector('.avg_rating')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('7.9')
  })

  test('converts avg_rating_friends from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall.html')
    const element = dom.window.document.querySelector('.avg_rating_friends')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('7.5')
  })

  test('converts review_rating with itemprop from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall.html')
    const elements = dom.window.document.querySelectorAll('.review_rating[itemprop="ratingValue"]')
    const element = elements[0]

    await runContentScript(dom)

    const image = element?.querySelector('img')
    expect(image?.getAttribute('alt')).toContain('10.0')
    expect(image?.getAttribute('title')).toContain('10.0')
  })

  test('converts rating_num from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall.html')
    const element = dom.window.document.querySelector('#rating_num_F_30')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('10')
  })
})
