import { convert } from './ratingConverter'

export const processElement = (element: HTMLElement, decimals: number = 1): boolean => {
  if (element.dataset.rymProcessed === 'true') return false
  const text = element.textContent?.trim() || ''
  const converted = convert(text, decimals)
  if (converted !== text && converted !== null && converted !== undefined) {
    element.textContent = converted
    element.dataset.rymProcessed = 'true'
    return true
  }
  return false
}

export const processAttribute = (
  element: HTMLElement,
  attribute: string,
  decimals: number = 1
): boolean => {
  const value = element.getAttribute(attribute)
  if (!value) return false
  const converted = convert(value, decimals)
  if (converted !== value && converted !== null && converted !== undefined) {
    element.setAttribute(attribute, converted)
    return true
  }
  return false
}
