const { loadHTMLFile, runContentScript } = require('./test-helpers');

describe('content.js DOM manipulation - profile', () => {
  test('converts numeric film ratings in profile filmrating section', async () => {
    const dom = loadHTMLFile('profile/profile.html');
    const ratingLinks = Array.from(dom.window.document.querySelectorAll('#filmrating a.medium')).filter(link => {
      const text = link.textContent.trim();
      const num = parseFloat(text);
      return !isNaN(num) && num >= 0.5 && num <= 5.0;
    });
    
    expect(ratingLinks.length).toBeGreaterThan(0);
    
    const originalValues = ratingLinks.map(link => parseFloat(link.textContent.trim()));
    
    await runContentScript(dom);
    
    ratingLinks.forEach((link, index) => {
      const convertedText = link.textContent.trim();
      const originalValue = originalValues[index];
      const expectedValue = (originalValue * 2).toFixed(1);
      expect(convertedText).toBe(expectedValue);
    });
  });

  test('converts all numeric film ratings in profile filmrating section', async () => {
    const dom = loadHTMLFile('profile/profile.html');
    const ratingLinks = Array.from(dom.window.document.querySelectorAll('#filmrating a.medium')).filter(link => {
      const text = link.textContent.trim();
      const num = parseFloat(text);
      return !isNaN(num) && num >= 0.5 && num <= 5.0;
    });
    
    await runContentScript(dom);
    
    ratingLinks.forEach(link => {
      const text = link.textContent.trim();
      if (text !== 'Unrated') {
        const value = parseFloat(text);
        expect(value).toBeGreaterThanOrEqual(1.0);
        expect(value).toBeLessThanOrEqual(10.0);
      }
    });
  });
});
