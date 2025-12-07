import * as path from 'path'
import { loadHTMLFile, runContentScript } from '../test-helpers'

const testDataPath = path.join(
  __dirname,
  'testdata',
  'Gentlemen (Film, Crime)_ Reviews, Ratings, Cast and Crew - Rate Your Music.html'
)

describe('content.js DOM manipulation - gentlemen low rating', () => {
  test('does not double convert rating 1.0 when processed multiple times', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('.avg_rating[itemprop="ratingValue"]')

    expect(element).not.toBeNull()

    element!.textContent = '1.0'
    element!.setAttribute('content', '1.0')

    await runContentScript(dom)

    expect(element!.textContent?.trim()).toBe('2.0')

    await runContentScript(dom)

    expect(element!.textContent?.trim()).toBe('2.0')
  })

  test('does not double convert rating 2.0 when processed multiple times', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('.avg_rating[itemprop="ratingValue"]')

    expect(element).not.toBeNull()

    element!.textContent = '2.0'
    element!.setAttribute('content', '2.0')

    await runContentScript(dom)

    expect(element!.textContent?.trim()).toBe('4.0')

    await runContentScript(dom)

    expect(element!.textContent?.trim()).toBe('4.0')
  })

  test('does not double convert rating 2.4 when processed multiple times', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('.avg_rating[itemprop="ratingValue"]')

    expect(element).not.toBeNull()

    element!.textContent = '2.4'
    element!.setAttribute('content', '2.4')

    await runContentScript(dom)

    expect(element!.textContent?.trim()).toBe('4.8')

    await runContentScript(dom)

    expect(element!.textContent?.trim()).toBe('4.8')
  })
})
