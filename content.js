function convertRating(value) {
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num) || num < 0.5 || num > 5.0) return value;
  return (num * 2).toFixed(1);
}

function updateValue(element, getValue, setValue) {
  const value = getValue();
  if (!value) return;
  const converted = convertRating(value);
  if (converted !== value) setValue(converted);
}

function processRatings() {
  document.querySelectorAll('.avg_rating, .avg_rating_friends, .rating_num, [itemprop="ratingValue"]').forEach(element => {
    updateValue(element, () => element.textContent.trim(), val => element.textContent = val);
    
    if (element.classList.contains('avg_rating') || element.hasAttribute('itemprop')) {
      updateValue(element, () => element.getAttribute('content'), val => element.setAttribute('content', val));
    }
    
    if (element.classList.contains('review_rating')) {
      const img = element.querySelector('img');
      if (img) ['alt', 'title'].forEach(attr => updateValue(img, () => img.getAttribute(attr), val => img.setAttribute(attr, val)));
    }
  });
}

let observer = null;

function startObserver() {
  if (observer) return;
  
  observer = new MutationObserver((mutations) => {
    const hasRelevantChanges = mutations.some(m => 
      m.type === 'childList' && Array.from(m.addedNodes).some(node => 
        node.nodeType === Node.ELEMENT_NODE && node.matches && (
          node.matches('.avg_rating, .avg_rating_friends, .rating_num, [itemprop="ratingValue"]') ||
          node.querySelector('.avg_rating, .avg_rating_friends, .rating_num, [itemprop="ratingValue"]')
        )
      )
    );
    
    if (!hasRelevantChanges) return;
    
    observer.disconnect();
    observer = null;
    
    setTimeout(() => {
      processRatings();
      startObserver();
    }, 100);
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

const init = () => { processRatings(); startObserver(); };
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
