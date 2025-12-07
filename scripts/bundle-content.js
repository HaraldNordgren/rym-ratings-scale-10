const fs = require('fs')
const path = require('path')

const distPath = path.join(__dirname, '..', 'dist')
const ratingConverterPath = path.join(distPath, 'ratingConverter.js')
const contentPath = path.join(distPath, 'content.js')

const ratingConverterCode = fs.readFileSync(ratingConverterPath, 'utf8')
const contentCode = fs.readFileSync(contentPath, 'utf8')

const bundledCode = contentCode.replace(
  /import\s*{\s*convert\s*}\s*from\s*['"]\.\/ratingConverter['"];?/,
  ratingConverterCode
    .replace(/export\s*{\s*convertRating,\s*convert\s*};?/, '')
    .replace(/\/\/# sourceMappingURL=.*$/gm, '')
)

fs.writeFileSync(contentPath, bundledCode, 'utf8')
