const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const contentScript = fs.readFileSync(path.join(__dirname, '..', '..', 'content.js'), 'utf8');

const loadHTMLFile = (filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const fileUrl = `file://${path.resolve(filePath)}`;
  const virtualConsole = new (require('jsdom').VirtualConsole)();
  virtualConsole.on('error', () => {});
  virtualConsole.on('jsdomError', () => {});
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    resources: 'usable',
    url: fileUrl,
    virtualConsole: virtualConsole
  });
  return dom;
};

const runContentScript = (dom) => {
  dom.window.eval(contentScript);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 150);
  });
};

describe('content.js DOM manipulation', () => {
  test('converts avg_rating from annie-hall.html', async () => {
    const htmlPath = path.join(__dirname, '..', '..', 'testdata', 'annie-hall', 'annie-hall.html');
    const dom = loadHTMLFile(htmlPath);
    const document = dom.window.document;
    
    const element = document.querySelector('.avg_rating');
    expect(element).toBeTruthy();
    expect(element.textContent.trim()).toBe('3.94');
    expect(element.hasAttribute('itemprop')).toBe(true);

    await runContentScript(dom);
    
    expect(element.textContent.trim()).toBe('7.9');
    if (element.hasAttribute('content')) {
      expect(element.getAttribute('content')).toBe('7.9');
    }
  });

  test('converts avg_rating_friends from annie-hall.html', async () => {
    const htmlPath = path.join(__dirname, '..', '..', 'testdata', 'annie-hall', 'annie-hall.html');
    const dom = loadHTMLFile(htmlPath);
    const document = dom.window.document;
    
    const element = document.querySelector('.avg_rating_friends');
    expect(element).toBeTruthy();
    expect(element.textContent.trim()).toBe('3.73');

    await runContentScript(dom);
    
    expect(element.textContent.trim()).toBe('7.5');
  });

  test('converts review_rating with itemprop from annie-hall.html', async () => {
    const htmlPath = path.join(__dirname, '..', '..', 'testdata', 'annie-hall', 'annie-hall.html');
    const dom = loadHTMLFile(htmlPath);
    const document = dom.window.document;
    
    const elements = document.querySelectorAll('.review_rating[itemprop="ratingValue"]');
    expect(elements.length).toBeGreaterThan(0);
    
    const element = elements[0];
    const originalContent = element.getAttribute('content');
    expect(originalContent).toBeTruthy();

    await runContentScript(dom);
    
    const convertedContent = element.getAttribute('content');
    const image = element.querySelector('img');
    expect(image).toBeTruthy();
    
    if (parseFloat(originalContent) >= 0.5 && parseFloat(originalContent) <= 5.0) {
      const expectedValue = (parseFloat(originalContent) * 2).toFixed(1);
      expect(convertedContent).toBe(expectedValue);
      expect(image.getAttribute('alt')).toContain(expectedValue);
      expect(image.getAttribute('title')).toContain(expectedValue);
    }
  });

  test('converts chart page average_num from custom-chart.html', async () => {
    const htmlPath = path.join(__dirname, '..', '..', 'testdata', 'film-chart', 'custom-chart.html');
    const dom = loadHTMLFile(htmlPath);
    const document = dom.window.document;
    
    const elements = document.querySelectorAll('.page_charts_section_charts_item_details_average_num');
    expect(elements.length).toBeGreaterThan(0);
    
    const element = elements[0];
    const originalValue = element.textContent.trim();
    expect(originalValue).toBeTruthy();

    await runContentScript(dom);
    
    const convertedValue = element.textContent.trim();
    if (parseFloat(originalValue) >= 0.5 && parseFloat(originalValue) <= 5.0) {
      const expectedValue = (parseFloat(originalValue) * 2).toFixed(1);
      expect(convertedValue).toBe(expectedValue);
    }
  });

  test('converts multiple chart page ratings from custom-chart.html', async () => {
    const htmlPath = path.join(__dirname, '..', '..', 'testdata', 'film-chart', 'custom-chart.html');
    const dom = loadHTMLFile(htmlPath);
    const document = dom.window.document;
    
    const elements = Array.from(document.querySelectorAll('.page_charts_section_charts_item_details_average_num')).slice(0, 3);
    expect(elements.length).toBe(3);
    
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
    const htmlPath = path.join(__dirname, '..', '..', 'testdata', 'film-chart', 'custom-chart.html');
    const dom = loadHTMLFile(htmlPath);
    const document = dom.window.document;
    
    const elements = document.querySelectorAll('.page_charts_section_charts_item_details_average_num');
    expect(elements.length).toBeGreaterThan(0);
    
    await runContentScript(dom);
    
    elements.forEach(element => {
      const value = parseFloat(element.textContent.trim());
      expect(value).toBeGreaterThanOrEqual(1.0);
      expect(value).toBeLessThanOrEqual(10.0);
    });
  });
});
