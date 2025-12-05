const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const fs = require('fs')
const path = require('path')
const { JSDOM, VirtualConsole } = require('jsdom')

const contentScript = fs.readFileSync(path.join(__dirname, '..', '..', 'content.js'), 'utf8')
const testdataPath = path.join(__dirname, '..', '..', '..', 'testdata')

const loadHTMLFile = (relativePath) => {
  const html = fs.readFileSync(path.join(testdataPath, relativePath), 'utf8')
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('error', () => {})
  virtualConsole.on('jsdomError', () => {})
  return new JSDOM(html, {
    runScripts: 'outside-only',
    url: `file://${path.resolve(testdataPath, relativePath)}`,
    virtualConsole,
  })
}

const runContentScript = (dom) => {
  dom.window.eval(contentScript)
  return new Promise((resolve) => setTimeout(resolve, 150))
}

module.exports = { loadHTMLFile, runContentScript }
