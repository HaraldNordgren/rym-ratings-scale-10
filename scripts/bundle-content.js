const fs = require('fs')
const path = require('path')

const DIST_DIR = path.join(__dirname, '..', 'dist')
const ENTRY_FILE = 'content.js'

const removeExports = (code) => {
  return code
    .replace(/export\s+(const|let|var|function|class|async\s+function)\s+/g, '$1 ')
    .replace(/export\s*\{[^}]*\}\s*;?/g, '')
    .replace(/\/\/# sourceMappingURL=.*$/gm, '')
}

const getLocalImports = (code) => {
  const matches = code.matchAll(/import\s*\{[^}]*\}\s*from\s*['"]\.\/(\w+)['"];?/g)
  return Array.from(matches, (m) => m[1])
}

const bundleImports = (code, bundled = new Set()) => {
  const imports = getLocalImports(code)
  if (imports.length === 0) return code

  let result = code
  for (const moduleName of imports) {
    if (bundled.has(moduleName)) {
      result = result.replace(
        new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*['"]\\.\\/${moduleName}['"];?`, 'g'),
        ''
      )
      continue
    }

    const modulePath = path.join(DIST_DIR, `${moduleName}.js`)
    if (!fs.existsSync(modulePath)) continue

    bundled.add(moduleName)
    let moduleCode = fs.readFileSync(modulePath, 'utf8')
    moduleCode = removeExports(moduleCode)
    moduleCode = bundleImports(moduleCode, bundled)

    result = result.replace(
      new RegExp(`import\\s*\\{[^}]*\\}\\s*from\\s*['"]\\.\\/${moduleName}['"];?`, 'g'),
      moduleCode
    )
  }

  return result
}

const entryPath = path.join(DIST_DIR, ENTRY_FILE)
let code = fs.readFileSync(entryPath, 'utf8')
code = bundleImports(code)
code = removeExports(code)
fs.writeFileSync(entryPath, code, 'utf8')
