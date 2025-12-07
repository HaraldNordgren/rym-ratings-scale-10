import { convertRating } from '../ratingConverter'

describe('convertRating', () => {
  test('converts 3.94 to 7.9', () => {
    expect(convertRating('3.94')).toBe('7.9')
  })

  test('converts 3.73 to 7.5', () => {
    expect(convertRating('3.73')).toBe('7.5')
  })

  test('converts 5.0 to 10.0', () => {
    expect(convertRating('5.0')).toBe('10.0')
  })

  test('converts 4.50 to 9.0', () => {
    expect(convertRating('4.50')).toBe('9.0')
  })

  test('converts 2.50 to 5.0', () => {
    expect(convertRating('2.50')).toBe('5.0')
  })

  test('converts 0.5 to 1.0', () => {
    expect(convertRating('0.5')).toBe('1.0')
  })

  test('converts 1.0 to 2.0', () => {
    expect(convertRating('1.0')).toBe('2.0')
  })

  test('converts 4.25 to 8.5', () => {
    expect(convertRating('4.25')).toBe('8.5')
  })

  test('converts 3.14159 to 6.3 (rounds to 1 decimal)', () => {
    expect(convertRating('3.14159')).toBe('6.3')
  })

  test('handles integer input', () => {
    expect(convertRating('3')).toBe('6.0')
  })

  test('handles whitespace', () => {
    expect(convertRating('  3.94  ')).toBe('7.9')
  })

  test('returns original value for non-numeric input', () => {
    expect(convertRating('not a number')).toBe('not a number')
  })

  test('handles empty string', () => {
    expect(convertRating('')).toBe('')
  })

  test('handles null', () => {
    expect(convertRating(null)).toBe(null)
  })

  test('handles undefined', () => {
    expect(convertRating(undefined)).toBe(undefined)
  })

  test('handles Infinity', () => {
    expect(convertRating('Infinity')).toBe('Infinity')
  })

  test('handles -Infinity', () => {
    expect(convertRating('-Infinity')).toBe('-Infinity')
  })

  test('does not convert values already on 10-point scale', () => {
    expect(convertRating('7.9')).toBe('7.9')
    expect(convertRating('10.0')).toBe('10.0')
    expect(convertRating('15.5')).toBe('15.5')
  })

  test('does not convert values outside valid range', () => {
    expect(convertRating('0.4')).toBe('0.4')
    expect(convertRating('6.0')).toBe('6.0')
  })
})
