const fs = require('fs')
const path = require('path')

const distPath = path.join(__dirname, '..', 'dist')

const readAndCleanModule = (modulePath) => {
  const code = fs.readFileSync(modulePath, 'utf8')
  return code
    .replace(/export\s+(const|let|var|function|class|async\s+function)\s+/g, '$1 ')
    .replace(/export\s*\{[^}]*\}\s*;?/g, '')
    .replace(/\/\/# sourceMappingURL=.*$/gm, '')
}

const bundleAllImports = (code, bundledModules = new Set()) => {
  const imports = code.match(/import\s*\{[^}]*\}\s*from\s*['"]\.\/(\w+)['"];?/g) || []
  const moduleNames = imports
    .map((imp) => {
      const match = imp.match(/['"]\.\/(\w+)['"]/)
      return match ? match[1] : null
    })
    .filter(Boolean)

  if (moduleNames.length === 0) {
    return code
  }

  let result = code
  for (const moduleName of moduleNames) {
    if (bundledModules.has(moduleName)) {
      const importRegex = new RegExp(
        `import\\s*\\{[^}]*\\}\\s*from\\s*['"]\\.\\/${moduleName}['"];?`,
        'g'
      )
      result = result.replace(importRegex, '')
      continue
    }

    const modulePath = path.join(distPath, `${moduleName}.js`)
    if (!fs.existsSync(modulePath)) {
      continue
    }

    bundledModules.add(moduleName)
    let moduleCode = readAndCleanModule(modulePath)
    moduleCode = bundleAllImports(moduleCode, bundledModules)

    const importRegex = new RegExp(
      `import\\s*\\{[^}]*\\}\\s*from\\s*['"]\\.\\/${moduleName}['"];?`,
      'g'
    )
    result = result.replace(importRegex, moduleCode)
  }

  return result
}

const contentPath = path.join(distPath, 'content.js')
let bundledCode = fs.readFileSync(contentPath, 'utf8')

bundledCode = bundleAllImports(bundledCode)

bundledCode = bundledCode.replace(
  /export\s+(const|let|var|function|class|async\s+function)\s+/g,
  '$1 '
)
bundledCode = bundledCode.replace(/export\s*\{[^}]*\}\s*;?/g, '')

fs.writeFileSync(contentPath, bundledCode, 'utf8')
