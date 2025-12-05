const convert = value => {
  const number = parseFloat(value);
  if (number >= 0.5 && number <= 5.0) {
    return (number * 2).toFixed(1);
  }
  return value;
};

const update = (getValue, setValue) => {
  const value = getValue();
  if (value) {
    const converted = convert(value);
    if (converted !== value) {
      setValue(converted);
    }
  }
};

const processRatings = () => {
  document.querySelectorAll('.avg_rating, .avg_rating_friends, .page_charts_section_charts_item_details_average_num, [itemprop="ratingValue"]').forEach(element => {
    update(() => {
      return element.textContent.trim();
    }, value => {
      element.textContent = value;
    });
    
    if (element.classList.contains('avg_rating') || element.hasAttribute('itemprop')) {
      update(() => {
        return element.getAttribute('content');
      }, value => {
        element.setAttribute('content', value);
      });
    }
    
    if (element.classList.contains('review_rating')) {
      const image = element.querySelector('img');
      if (image) {
        ['alt', 'title'].forEach(attribute => {
          update(() => {
            return image.getAttribute(attribute);
          }, value => {
            image.setAttribute(attribute, value);
          });
        });
      }
    }
  });

  document.querySelectorAll('#filmrating a.medium').forEach(element => {
    const text = element.textContent.trim();
    const converted = convert(text);
    if (converted !== text) {
      element.textContent = converted;
    }
  });
};

let observer = null;
const startObserver = () => {
  if (observer) return;
  observer = new MutationObserver(() => {
    observer.disconnect();
    observer = null;
    processRatings();
    startObserver();
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

const init = () => {
  processRatings();
  startObserver();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
