# RYM Ratings Scale 10

A Chrome extension that converts RateYourMusic ratings from a 5-point scale to a 10-point scale by multiplying all ratings by 10 and rounding to 1 decimal place.

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the directory containing this extension

## Usage

Once installed, the extension automatically converts all ratings on rateyourmusic.com pages:
- Average ratings (`.avg_rating`)
- Friends ratings (`.avg_rating_friends`)
- User's own ratings (`.rating_num`)
- Review ratings (`[itemprop="ratingValue"]`)

For example, a rating of 3.94 will be displayed as 7.9.

## Testing

Run the test suite:

```bash
npm install
npm test
```

## Files

- `manifest.json` - Chrome extension manifest
- `content.js` - Content script that modifies ratings on the page
- `src/ratingConverter.js` - Rating conversion utility function
- `src/ratingConverter.test.js` - Unit tests for rating conversion

