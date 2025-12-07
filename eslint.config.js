const js = require('@eslint/js')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['eslint.config.js', 'dist/**', 'node_modules/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        MutationObserver: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      curly: ['error', 'all'],
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        fs: 'readonly',
        path: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
)
