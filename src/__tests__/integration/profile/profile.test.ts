import * as path from 'path'
import { loadHTMLFile, runContentScript } from '../test-helpers'

const testDataPath = path.join(__dirname, 'testdata', 'profile.html')

describe('content.js DOM manipulation - profile', () => {
  test('converts numeric film rating in profile filmrating section', async () => {
    const dom = loadHTMLFile(testDataPath)
    const elements = Array.from(dom.window.document.querySelectorAll('#filmrating a.medium'))
    const element = elements.find((el) => el.textContent?.trim() === '4.0')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('8')
  })

  test('converts numeric music rating in profile musicrating section', async () => {
    const dom = loadHTMLFile(testDataPath)
    const elements = Array.from(dom.window.document.querySelectorAll('#musicrating a.medium'))
    const element = elements.find((el) => el.textContent?.trim() === '4.0')

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('8')
  })
})
