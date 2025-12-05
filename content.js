const PROCESSED_ATTR = 'data-rym-converted';

function convertRating(rating) {
  const num = parseFloat(rating);
  if (isNaN(num) || !isFinite(num)) return rating;
  if (num < 0.5 || num > 5.0) return rating;
  const converted = num * 2;
  return converted.toFixed(1);
}

function updateTextContent(element) {
  if (element.hasAttribute(PROCESSED_ATTR)) return;
  
  const text = element.textContent.trim();
  if (!text) return;
  
  const num = parseFloat(text);
  if (isNaN(num) || !isFinite(num)) return;
  if (num < 0.5 || num > 5.0) return;
  
  const converted = convertRating(text);
  if (converted !== text) {
    element.setAttribute(PROCESSED_ATTR, 'true');
    element.textContent = converted;
  }
}

function updateAttribute(element, attribute) {
  const value = element.getAttribute(attribute);
  if (!value) return;
  
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) return;
  if (num < 0.5 || num > 5.0) return;
  
  const converted = convertRating(value);
  if (converted !== value) {
    element.setAttribute(attribute, converted);
  }
}

function processRatings() {
  document.querySelectorAll('.avg_rating').forEach(element => {
    if (!element.hasAttribute(PROCESSED_ATTR)) {
      updateTextContent(element);
      updateAttribute(element, 'content');
    }
  });

  document.querySelectorAll('.avg_rating_friends').forEach(element => {
    if (!element.hasAttribute(PROCESSED_ATTR)) {
      updateTextContent(element);
    }
  });

  document.querySelectorAll('.rating_num').forEach(element => {
    if (!element.hasAttribute(PROCESSED_ATTR)) {
      updateTextContent(element);
    }
  });

  document.querySelectorAll('span.review_rating[itemprop="ratingValue"]').forEach(element => {
    if (!element.hasAttribute(PROCESSED_ATTR)) {
      updateAttribute(element, 'content');
      const img = element.querySelector('img');
      if (img) {
        updateAttribute(img, 'alt');
        updateAttribute(img, 'title');
      }
      element.setAttribute(PROCESSED_ATTR, 'true');
    }
  });

  document.querySelectorAll('[itemprop="ratingValue"]').forEach(element => {
    if (!element.classList.contains('review_rating') && !element.hasAttribute(PROCESSED_ATTR)) {
      updateTextContent(element);
      updateAttribute(element, 'content');
    }
  });
}

let observer = null;
let processing = false;

function startObserver() {
  if (observer) return;
  
  observer = new MutationObserver((mutations) => {
    if (processing) return;
    
    const hasRelevantChanges = mutations.some(mutation => {
      if (mutation.type !== 'childList') return false;
      const addedNodes = Array.from(mutation.addedNodes);
      return addedNodes.some(node => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        return node.matches && (
          node.matches('.avg_rating, .avg_rating_friends, .rating_num, [itemprop="ratingValue"]') ||
          node.querySelector('.avg_rating, .avg_rating_friends, .rating_num, [itemprop="ratingValue"]')
        );
      });
    });
    
    if (!hasRelevantChanges) return;
    
    processing = true;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    
    setTimeout(() => {
      processRatings();
      processing = false;
      startObserver();
    }, 100);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    processRatings();
    startObserver();
  });
} else {
  processRatings();
  startObserver();
}
