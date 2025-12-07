import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

import * as fs from 'fs'
import * as path from 'path'
import { JSDOM, VirtualConsole } from 'jsdom'

const distPath = path.join(__dirname, '..', '..', '..', 'dist')
const contentScript = fs.readFileSync(path.join(distPath, 'content.js'), 'utf8')

const loadHTMLFile = (htmlPath: string): JSDOM => {
  const html = fs.readFileSync(htmlPath, 'utf8')
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('error', () => {}).on('jsdomError', () => {})
  return new JSDOM(html, {
    runScripts: 'outside-only',
    url: `file://${path.resolve(htmlPath)}`,
    virtualConsole,
  })
}

const runContentScript = async (dom: JSDOM): Promise<void> => {
  dom.window.eval(contentScript)
  await new Promise((resolve) => setTimeout(resolve, 100))
}

export { loadHTMLFile, runContentScript }
