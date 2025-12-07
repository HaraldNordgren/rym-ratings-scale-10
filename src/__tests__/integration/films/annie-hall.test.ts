import * as path from 'path'
import { loadHTMLFile, runContentScript } from '../test-helpers'

const testDataPath = path.join(__dirname, 'testdata', 'annie-hall.html')

describe('content.js DOM manipulation - annie-hall', () => {
  test('converts avg_rating from annie-hall.html', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('.avg_rating')

    expect(element?.textContent?.trim()).toBe('3.94')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('7.9')
  })

  test('converts avg_rating_friends from annie-hall.html', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('.avg_rating_friends')

    expect(element?.textContent?.trim()).toBe('3.73')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('7.5')
  })

  test('converts review_rating with itemprop from annie-hall.html', async () => {
    const dom = loadHTMLFile(testDataPath)
    const elements = dom.window.document.querySelectorAll('.review_rating[itemprop="ratingValue"]')
    const image = elements[0]?.querySelector('img')

    expect(image?.getAttribute('alt')).toContain('5.0')
    expect(image?.getAttribute('title')).toContain('5.0')

    await runContentScript(dom)

    expect(image?.getAttribute('alt')).toContain('10.0')
    expect(image?.getAttribute('title')).toContain('10.0')
  })

  test('converts rating_num from annie-hall.html', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('#rating_num_F_30')

    expect(element?.textContent?.trim()).toBe('5.0')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('10')
  })
})
