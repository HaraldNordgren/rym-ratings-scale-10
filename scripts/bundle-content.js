const fs = require('fs')
const path = require('path')

const DIST_DIR = path.join(__dirname, '..', 'dist')
const ENTRY_FILE = 'content.js'
const IMPORT_REGEX = /import\s*\{[^}]*\}\s*from\s*['"]\.\/(\w+)['"];?/g

const removeExports = (code) =>
  code
    .replace(/export\s+(const|let|var|function|class|async\s+function)\s+/g, '$1 ')
    .replace(/export\s*\{[^}]*\}\s*;?/g, '')
    .replace(/\/\/# sourceMappingURL=.*$/gm, '')

const bundleImports = (code, bundled = new Set()) => {
  const imports = [...code.matchAll(IMPORT_REGEX)].map((m) => m[1])
  if (imports.length === 0) {
    return code
  }

  let result = code
  for (const moduleName of imports) {
    const importPattern = new RegExp(
      `import\\s*\\{[^}]*\\}\\s*from\\s*['"]\\.\\/${moduleName}['"];?`,
      'g'
    )

    if (bundled.has(moduleName)) {
      result = result.replace(importPattern, '')
      continue
    }

    const modulePath = path.join(DIST_DIR, `${moduleName}.js`)
    if (!fs.existsSync(modulePath)) {
      continue
    }

    bundled.add(moduleName)
    let moduleCode = fs.readFileSync(modulePath, 'utf8')
    moduleCode = removeExports(bundleImports(moduleCode, bundled))
    result = result.replace(importPattern, moduleCode)
  }

  return result
}

const entryPath = path.join(DIST_DIR, ENTRY_FILE)
let code = fs.readFileSync(entryPath, 'utf8')
code = removeExports(bundleImports(code))
fs.writeFileSync(entryPath, code, 'utf8')
