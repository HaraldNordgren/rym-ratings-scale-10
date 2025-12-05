const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - profile', () => {
  test('converts numeric film rating in profile filmrating section', async () => {
    const dom = loadHTMLFile('profile.html')
    const elements = Array.from(dom.window.document.querySelectorAll('#filmrating a.medium'))
    const element = elements.find((el) => el.textContent.trim() === '4.0')

    await runContentScript(dom)

    expect(element.textContent.trim()).toBe('8')
  })
})
