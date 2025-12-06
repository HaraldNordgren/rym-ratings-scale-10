const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const fs = require('fs')
const path = require('path')
const { JSDOM, VirtualConsole } = require('jsdom')

const contentScript = fs.readFileSync(path.join(__dirname, '..', '..', 'content.js'), 'utf8')

const loadHTMLFile = (relativePath) => {
  const stack = new Error().stack
  const stackLines = stack.split('\n')
  const callerLine = stackLines[2]
  const match = callerLine.match(/\((.+):\d+:\d+\)/) || callerLine.match(/at (.+):\d+:\d+/)
  const callerFile = match ? match[1] : __filename
  const callerDir = path.dirname(callerFile)
  const htmlPath = path.join(callerDir, 'testdata', relativePath)
  const html = fs.readFileSync(htmlPath, 'utf8')
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('error', () => {})
  virtualConsole.on('jsdomError', () => {})
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
