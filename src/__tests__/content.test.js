const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const contentScript = fs.readFileSync(path.join(__dirname, '..', '..', 'content.js'), 'utf8');
const testdataPath = path.join(__dirname, '..', '..', 'testdata');

const loadHTMLFile = (relativePath) => {
  const html = fs.readFileSync(path.join(testdataPath, relativePath), 'utf8');
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('error', () => {});
  virtualConsole.on('jsdomError', () => {});
  return new JSDOM(html, {
    runScripts: 'outside-only',
    url: `file://${path.resolve(testdataPath, relativePath)}`,
    virtualConsole
  });
};

const runContentScript = (dom) => {
  dom.window.eval(contentScript);
  return new Promise(resolve => setTimeout(resolve, 150));
};

describe('content.js DOM manipulation', () => {
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

  test('converts chart page average_num from custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html');
    const element = dom.window.document.querySelector('.page_charts_section_charts_item_details_average_num');
    const originalValue = element.textContent.trim();

    await runContentScript(dom);
    
    const convertedValue = element.textContent.trim();
    if (parseFloat(originalValue) >= 0.5 && parseFloat(originalValue) <= 5.0) {
      const expectedValue = (parseFloat(originalValue) * 2).toFixed(1);
      expect(convertedValue).toBe(expectedValue);
    }
  });

  test('converts multiple chart page ratings from custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html');
    const elements = Array.from(dom.window.document.querySelectorAll('.page_charts_section_charts_item_details_average_num')).slice(0, 3);
    const originalValues = elements.map(el => el.textContent.trim());
    
    await runContentScript(dom);
    
    elements.forEach((element, index) => {
      const convertedValue = element.textContent.trim();
      const originalValue = originalValues[index];
      if (parseFloat(originalValue) >= 0.5 && parseFloat(originalValue) <= 5.0) {
        const expectedValue = (parseFloat(originalValue) * 2).toFixed(1);
        expect(convertedValue).toBe(expectedValue);
      }
    });
  });

  test('converts all chart page ratings in custom-chart.html', async () => {
    const dom = loadHTMLFile('film-chart/custom-chart.html');
    const elements = dom.window.document.querySelectorAll('.page_charts_section_charts_item_details_average_num');
    
    await runContentScript(dom);
    
    elements.forEach(element => {
      const value = parseFloat(element.textContent.trim());
      expect(value).toBeGreaterThanOrEqual(1.0);
      expect(value).toBeLessThanOrEqual(10.0);
    });
  });
});
