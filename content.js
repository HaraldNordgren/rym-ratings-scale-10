const convert = v => {
  const n = parseFloat(v);
  return (n >= 0.5 && n <= 5.0) ? (n * 2).toFixed(1) : v;
};

const update = (el, get, set) => {
  const v = get();
  if (v) { const c = convert(v); if (c !== v) set(c); }
};

const processRatings = () => {
  document.querySelectorAll('.avg_rating, .avg_rating_friends, .rating_num, [itemprop="ratingValue"]').forEach(el => {
    update(el, () => el.textContent.trim(), v => el.textContent = v);
    if (el.classList.contains('avg_rating') || el.hasAttribute('itemprop')) update(el, () => el.getAttribute('content'), v => el.setAttribute('content', v));
    if (el.classList.contains('review_rating')) {
      const img = el.querySelector('img');
      if (img) ['alt', 'title'].forEach(a => update(img, () => img.getAttribute(a), v => img.setAttribute(a, v)));
    }
  });
};

let observer = null;
const startObserver = () => {
  if (observer) return;
  observer = new MutationObserver(() => {
    observer.disconnect();
    observer = null;
    setTimeout(() => { processRatings(); startObserver(); }, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

const init = () => { processRatings(); startObserver(); };
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
