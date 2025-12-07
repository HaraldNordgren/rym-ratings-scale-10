function convertRating(rating: string | null | undefined): string | null | undefined {
  const num = parseFloat(rating as string)
  if (isNaN(num) || !isFinite(num)) return rating
  if (num < 0.5 || num > 5.0) return rating
  const converted = num * 2
  return converted.toFixed(1)
}

export { convertRating }
