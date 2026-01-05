import * as path from 'path'
import { loadHTMLFile, runContentScript } from '../test-helpers'

const testDataPath = path.join(
  __dirname,
  'testdata',
  'Sade Albums_ songs, discography, biography, and listening guide - Rate Your Music.html'
)

const nasTestDataPath = path.join(
  __dirname,
  'testdata',
  'Nas Albums_ songs, discography, biography, and listening guide - Rate Your Music.html'
)

describe('content.js DOM manipulation - artist songs', () => {
  test('converts page_artist_tracks_track_stats_rating from artist page', async () => {
    const dom = loadHTMLFile(testDataPath)
    const elements = Array.from(
      dom.window.document.querySelectorAll('.page_artist_tracks_track_stats_rating')
    )
    const element = elements.find((el) => {
      return el.textContent?.trim() === '4.0'
    })

    await runContentScript(dom)

    expect(element?.textContent?.trim()).toBe('8.0')
  })

  test('converts multiple song ratings from artist page', async () => {
    const dom = loadHTMLFile(testDataPath)
    const elements = Array.from(
      dom.window.document.querySelectorAll('.page_artist_tracks_track_stats_rating')
    )
    const element44 = elements.find((el) => {
      return el.textContent?.trim() === '4.4'
    })
    const element46 = elements.find((el) => {
      return el.textContent?.trim() === '4.6'
    })

    await runContentScript(dom)

    expect(element44?.textContent?.trim()).toBe('8.8')
    expect(element46?.textContent?.trim()).toBe('9.2')
  })

  test('converts disco_cat_inner from artist page cataloged', async () => {
    const dom = loadHTMLFile(nasTestDataPath)
    const elements = Array.from(dom.window.document.querySelectorAll('.disco_cat_inner'))
    const element50 = elements.find((el) => {
      return el.textContent?.trim() === '5.0/CD'
    })
    const element30 = elements.find((el) => {
      return el.textContent?.trim() === '3.0'
    })

    await runContentScript(dom)

    expect(element50?.textContent?.trim()).toBe('10/CD')
    expect(element30?.textContent?.trim()).toBe('6')
  })
})
