const convert = (
  value: string | null | undefined,
  decimals: number = 1
): string | null | undefined => {
  if (value === null || value === undefined) return value
  const number = parseFloat(value)
  if (isNaN(number) || !isFinite(number)) return value
  if (number < 0.5 || number > 5.0) return value
  return (number * 2).toFixed(decimals)
}

const convertRating = (rating: string | null | undefined): string | null | undefined => {
  return convert(rating, 1)
}

export { convertRating, convert }
