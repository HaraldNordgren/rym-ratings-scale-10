const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const fs = require('fs')
const path = require('path')
const { JSDOM, VirtualConsole } = require('jsdom')

const contentScript = fs.readFileSync(path.join(__dirname, '..', '..', 'content.js'), 'utf8')

const loadHTMLFile = (relativePath) => {
  const callerLine = new Error().stack.split('\n')[2]
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

const runContentScript = (dom) => {
  dom.window.eval(contentScript)
  return new Promise((resolve) => setTimeout(resolve, 150))
}

module.exports = { loadHTMLFile, runContentScript }
