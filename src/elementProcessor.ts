import { convert, convertCatalog } from './ratingConverter'

export const processElement = (element: HTMLElement, decimals: number = 1): boolean => {
  if (element.dataset.rymProcessed === 'true') {
    return false
  }
  const text = element.textContent?.trim() || ''
  const converted = convert(text, decimals)
  if (converted && converted !== text) {
    element.textContent = converted
    element.dataset.rymProcessed = 'true'
    return true
  }
  return false
}

export const processCatalogElement = (element: HTMLElement): boolean => {
  if (element.dataset.rymProcessed === 'true') {
    return false
  }
  const catalogMsg = element.querySelector(
    '[id^="film_cat_catalog_msg_"], [id^="music_cat_catalog_msg_"]'
  ) as HTMLElement | null
  if (catalogMsg) {
    return processElement(catalogMsg, 0)
  }
  const text = element.textContent?.trim() || ''
  const converted = convertCatalog(text)
  if (converted && converted !== text) {
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
  if (!value) {
    return false
  }
  const converted = convert(value, decimals)
  if (converted && converted !== value) {
    element.setAttribute(attribute, converted)
    return true
  }
  return false
}
