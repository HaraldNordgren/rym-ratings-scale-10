import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

import * as fs from 'fs'
import * as path from 'path'
import { JSDOM, VirtualConsole } from 'jsdom'

const distPath = path.join(__dirname, '..', '..', '..', 'dist')
const ratingConverterScript = fs.readFileSync(path.join(distPath, 'ratingConverter.js'), 'utf8')
const contentScript = fs.readFileSync(path.join(distPath, 'content.js'), 'utf8')

const bundledScript = contentScript.replace(
  /import\s*{\s*convert\s*}\s*from\s*['"]\.\/ratingConverter['"];?/,
  ratingConverterScript.replace(/export\s*{\s*convertRating,\s*convert\s*};?/, '')
)

const loadHTMLFile = (relativePath: string): JSDOM => {
  const callerLine = new Error().stack?.split('\n')[2] || ''
  const match = callerLine.match(/\((.+):\d+:\d+\)/) || callerLine.match(/at (.+):\d+:\d+/)
  const callerFile = match?.[1] || __filename
  const htmlPath = path.join(path.dirname(callerFile), 'testdata', relativePath)
  const html = fs.readFileSync(htmlPath, 'utf8')
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('error', () => {}).on('jsdomError', () => {})
  return new JSDOM(html, {
    runScripts: 'outside-only',
    url: `file://${path.resolve(htmlPath)}`,
    virtualConsole,
  })
}

const runContentScript = (dom: JSDOM): Promise<void> => {
  dom.window.eval(bundledScript)
  return new Promise((resolve) => setTimeout(resolve, 150))
}

export { loadHTMLFile, runContentScript }
