// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 👇 añade esta línea para las reglas de hooks
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    '@typescript-eslint',
    // 👇 registra el plugin
    'react-hooks'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Buenas prácticas por defecto de los hooks (opcional si ya usas el 'recommended')
    // 'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  // Opcional: asegura lint adecuado para TSX
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        // aquí podrías afinar reglas específicas para TS/TSX si hace falta
      }
    }
  ]
}