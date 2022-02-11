module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  ignorePatterns: ['**.js'],
  extends: ['airbnb-base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 0,
  },
};
