const { loadHTMLFile, runContentScript } = require('./test-helpers')

describe('content.js DOM manipulation - profile', () => {
  test('converts numeric film rating in profile filmrating section', async () => {
    const dom = loadHTMLFile('profile/profile.html')
    const elements = Array.from(
      dom.window.document.querySelectorAll('#filmrating a.medium')
    )
    const element = elements.find((el) => {
      const text = el.textContent.trim()
      const num = parseFloat(text)
      return !isNaN(num) && num >= 0.5 && num <= 5.0
    })

    await runContentScript(dom)

    const convertedValue = parseFloat(element.textContent.trim())
    expect(convertedValue).toBeGreaterThanOrEqual(1.0)
    expect(convertedValue).toBeLessThanOrEqual(10.0)
  })
})
