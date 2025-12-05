const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - annie-hall', () => {
  test('converts avg_rating from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall/annie-hall.html')
    const element = dom.window.document.querySelector('.avg_rating')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('7.9')
  })

  test('converts avg_rating_friends from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall/annie-hall.html')
    const element = dom.window.document.querySelector('.avg_rating_friends')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('7.5')
  })

  test('converts review_rating with itemprop from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall/annie-hall.html')
    const elements = dom.window.document.querySelectorAll('.review_rating[itemprop="ratingValue"]')
    const element = elements[0]

    await runContentScript(dom)

    const image = element.querySelector('img')
    const altValue = image.getAttribute('alt')
    const titleValue = image.getAttribute('title')
    const ratingMatch = altValue.match(/\d+\.\d+/)
    if (ratingMatch) {
      const rating = parseFloat(ratingMatch[0])
      expect(rating).toBeGreaterThanOrEqual(1.0)
      expect(rating).toBeLessThanOrEqual(10.0)
      expect(titleValue).toContain(ratingMatch[0])
    }
  })
})
