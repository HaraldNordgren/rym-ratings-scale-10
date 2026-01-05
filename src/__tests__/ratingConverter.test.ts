import { convert, convertCatalog } from '../ratingConverter'

describe('convert', () => {
  test('converts 3.94 to 7.9', () => {
    expect(convert('3.94', 1)).toBe('7.9')
  })

  test('converts 3.73 to 7.5', () => {
    expect(convert('3.73', 1)).toBe('7.5')
  })

  test('converts 5.0 to 10.0', () => {
    expect(convert('5.0', 1)).toBe('10.0')
  })

  test('converts 4.50 to 9.0', () => {
    expect(convert('4.50', 1)).toBe('9.0')
  })

  test('converts 2.50 to 5.0', () => {
    expect(convert('2.50', 1)).toBe('5.0')
  })

  test('converts 0.5 to 1.0', () => {
    expect(convert('0.5', 1)).toBe('1.0')
  })

  test('converts 1.0 to 2.0', () => {
    expect(convert('1.0', 1)).toBe('2.0')
  })

  test('converts 4.25 to 8.5', () => {
    expect(convert('4.25', 1)).toBe('8.5')
  })

  test('converts 3.14159 to 6.3 (rounds to 1 decimal)', () => {
    expect(convert('3.14159', 1)).toBe('6.3')
  })

  test('handles integer input', () => {
    expect(convert('3', 1)).toBe('6.0')
  })

  test('handles whitespace', () => {
    expect(convert('  3.94  ', 1)).toBe('7.9')
  })

  test('returns original value for non-numeric input', () => {
    expect(convert('not a number', 1)).toBe('not a number')
  })

  test('handles empty string', () => {
    expect(convert('', 1)).toBe('')
  })

  test('handles null', () => {
    expect(convert(null, 1)).toBe(null)
  })

  test('handles undefined', () => {
    expect(convert(undefined, 1)).toBe(undefined)
  })

  test('handles Infinity', () => {
    expect(convert('Infinity', 1)).toBe('Infinity')
  })

  test('handles -Infinity', () => {
    expect(convert('-Infinity', 1)).toBe('-Infinity')
  })

  test('does not convert values already on 10-point scale', () => {
    expect(convert('7.9', 1)).toBe('7.9')
    expect(convert('10.0', 1)).toBe('10.0')
    expect(convert('15.5', 1)).toBe('15.5')
  })

  test('does not convert values outside valid range', () => {
    expect(convert('0.4', 1)).toBe('0.4')
    expect(convert('6.0', 1)).toBe('6.0')
  })
})

describe('convertCatalog', () => {
  test('converts 5.0/CD to 10.0/CD', () => {
    expect(convertCatalog('5.0/CD', 1)).toBe('10.0/CD')
  })

  test('converts 5.0/Cassette to 10.0/Cassette', () => {
    expect(convertCatalog('5.0/Cassette', 1)).toBe('10.0/Cassette')
  })

  test('converts 4.0/CD to 8.0/CD', () => {
    expect(convertCatalog('4.0/CD', 1)).toBe('8.0/CD')
  })

  test('converts 4.5/CD to 9.0/CD', () => {
    expect(convertCatalog('4.5/CD', 1)).toBe('9.0/CD')
  })

  test('converts 3.0 to 6.0 (no format part)', () => {
    expect(convertCatalog('3.0', 1)).toBe('6.0')
  })

  test('converts 2.5 to 5.0 (no format part)', () => {
    expect(convertCatalog('2.5', 1)).toBe('5.0')
  })

  test('handles empty string', () => {
    expect(convertCatalog('', 1)).toBe('')
  })

  test('handles null', () => {
    expect(convertCatalog(null, 1)).toBe(null)
  })

  test('handles undefined', () => {
    expect(convertCatalog(undefined, 1)).toBe(undefined)
  })

  test('returns original value for non-numeric input without slash', () => {
    expect(convertCatalog('CD', 1)).toBe('CD')
    expect(convertCatalog('Wishlist', 1)).toBe('Wishlist')
  })

  test('returns original value for non-numeric input with slash', () => {
    expect(convertCatalog('invalid/CD', 1)).toBe('invalid/CD')
  })

  test('does not convert values already on 10-point scale', () => {
    expect(convertCatalog('10.0/CD', 1)).toBe('10.0/CD')
    expect(convertCatalog('8.0/CD', 1)).toBe('8.0/CD')
  })

  test('does not convert values outside valid range', () => {
    expect(convertCatalog('0.4/CD', 1)).toBe('0.4/CD')
    expect(convertCatalog('6.0/CD', 1)).toBe('6.0/CD')
  })
})
