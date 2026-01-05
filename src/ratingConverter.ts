const convert = (
  value: string | null | undefined,
  decimals: number = 1
): string | null | undefined => {
  if (!value) {
    return value
  }
  const number = parseFloat(value)
  if (isNaN(number) || !isFinite(number)) {
    return value
  }
  if (number < 0.5 || number > 5.0) {
    return value
  }
  return (number * 2).toFixed(decimals)
}

const convertCatalog = (
  value: string | null | undefined,
  decimals: number = 1
): string | null | undefined => {
  if (!value) {
    return value
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return value
  }
  const slashIndex = trimmed.indexOf('/')
  if (slashIndex === -1) {
    return convert(trimmed, decimals)
  }
  const numberPart = trimmed.substring(0, slashIndex).trim()
  const formatPart = trimmed.substring(slashIndex + 1).trim()
  const convertedNumber = convert(numberPart, decimals)
  if (convertedNumber === numberPart) {
    return value
  }
  return `${convertedNumber}/${formatPart}`
}

export { convert, convertCatalog }
