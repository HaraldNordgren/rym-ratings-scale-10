import * as path from 'path'
import { loadHTMLFile, runContentScript } from '../test-helpers'

const testDataPath = path.join(
  __dirname,
  'testdata',
  'Gentlemen (Film, Crime)_ Reviews, Ratings, Cast and Crew - Rate Your Music.html'
)

describe('content.js DOM manipulation - gentlemen low rating', () => {
  test('does not double convert rating 2.30 when processed multiple times', async () => {
    const dom = loadHTMLFile(testDataPath)
    const element = dom.window.document.querySelector('.avg_rating')

    expect(element?.textContent?.trim()).toBe('2.30')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('4.6')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('4.6')
  })
})
