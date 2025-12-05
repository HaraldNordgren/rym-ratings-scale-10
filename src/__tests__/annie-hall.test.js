const { loadHTMLFile, runContentScript } = require('./test-helpers');

describe('content.js DOM manipulation - annie-hall', () => {
  test('converts avg_rating from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall/annie-hall.html');
    const element = dom.window.document.querySelector('.avg_rating');
    
    expect(element.textContent.trim()).toBe('3.94');
    expect(element.hasAttribute('itemprop')).toBe(true);

    await runContentScript(dom);
    
    expect(element.textContent.trim()).toBe('7.9');
    if (element.hasAttribute('content')) {
      expect(element.getAttribute('content')).toBe('7.9');
    }
  });

  test('converts avg_rating_friends from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall/annie-hall.html');
    const element = dom.window.document.querySelector('.avg_rating_friends');
    
    expect(element.textContent.trim()).toBe('3.73');

    await runContentScript(dom);
    
    expect(element.textContent.trim()).toBe('7.5');
  });

  test('converts review_rating with itemprop from annie-hall.html', async () => {
    const dom = loadHTMLFile('annie-hall/annie-hall.html');
    const elements = dom.window.document.querySelectorAll('.review_rating[itemprop="ratingValue"]');
    const element = elements[0];
    const originalContent = element.getAttribute('content');

    await runContentScript(dom);
    
    const convertedContent = element.getAttribute('content');
    const image = element.querySelector('img');
    
    if (parseFloat(originalContent) >= 0.5 && parseFloat(originalContent) <= 5.0) {
      const expectedValue = (parseFloat(originalContent) * 2).toFixed(1);
      expect(convertedContent).toBe(expectedValue);
      expect(image.getAttribute('alt')).toContain(expectedValue);
      expect(image.getAttribute('title')).toContain(expectedValue);
    }
  });
});
