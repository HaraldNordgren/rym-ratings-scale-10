import * as path from 'path'
import { loadHTMLFile, runContentScript } from '../test-helpers'

const testDataPath = path.join(
  __dirname,
  'testdata',
  'Sade Albums_ songs, discography, biography, and listening guide - Rate Your Music.html'
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
})
