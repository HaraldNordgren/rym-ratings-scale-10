const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const contentScript = fs.readFileSync(path.join(__dirname, '..', '..', 'content.js'), 'utf8');

const createDOM = () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    runScripts: 'dangerously',
    resources: 'usable'
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
  test('converts avg_rating from 3.94 to 7.9', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'avg_rating';
    element.textContent = '3.94';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('7.9');
  });

  test('converts avg_rating_friends from 3.73 to 7.5', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'avg_rating_friends';
    element.textContent = '3.73';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('7.5');
  });

  test('converts chart page average_num from 4.06 to 8.1', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'page_charts_section_charts_item_details_average_num';
    element.textContent = '4.06';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('8.1');
  });

  test('converts chart page average_num from 3.97 to 7.9', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'page_charts_section_charts_item_details_average_num';
    element.textContent = '3.97';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('7.9');
  });

  test('converts chart page average_num from 3.93 to 7.9', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'page_charts_section_charts_item_details_average_num';
    element.textContent = '3.93';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('7.9');
  });

  test('converts multiple chart page ratings', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element1 = document.createElement('span');
    element1.className = 'page_charts_section_charts_item_details_average_num';
    element1.textContent = '4.06';
    document.body.appendChild(element1);

    const element2 = document.createElement('span');
    element2.className = 'page_charts_section_charts_item_details_average_num';
    element2.textContent = '3.97';
    document.body.appendChild(element2);

    const element3 = document.createElement('span');
    element3.className = 'page_charts_section_charts_item_details_average_num';
    element3.textContent = '3.93';
    document.body.appendChild(element3);

    await runContentScript(dom);
    
    expect(element1.textContent).toBe('8.1');
    expect(element2.textContent).toBe('7.9');
    expect(element3.textContent).toBe('7.9');
  });

  test('does not convert values already on 10-point scale', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'page_charts_section_charts_item_details_average_num';
    element.textContent = '7.9';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('7.9');
  });

  test('handles chart page rating with whitespace', async () => {
    const dom = createDOM();
    const document = dom.window.document;
    
    const element = document.createElement('span');
    element.className = 'page_charts_section_charts_item_details_average_num';
    element.textContent = '  4.06  ';
    document.body.appendChild(element);

    await runContentScript(dom);
    
    expect(element.textContent).toBe('8.1');
  });
});
