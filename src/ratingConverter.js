function convertRating(rating) {
  const num = parseFloat(rating)
  if (isNaN(num) || !isFinite(num)) return rating
  if (num < 0.5 || num > 5.0) return rating
  const converted = num * 2
  return converted.toFixed(1)
}

module.exports = { convertRating }
