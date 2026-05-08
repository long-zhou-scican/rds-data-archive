module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  plugins: ['prettier', 'jest', 'jest-formatting', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:jest/all',
    'plugin:jest-formatting/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'require-await': 'error',
    'no-return-await': 'error',
    'prettier/prettier': 'error',
    'jest/require-hook': 'off',
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/max-expects': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/require-await': 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowDirectConstAssertionInArrowFunctions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            allowedNames: [],
          },
        ],
        '@typescript-eslint/typedef': [
          'error',
          {
            arrayDestructuring: false,
            arrowParameter: false,
            memberVariableDeclaration: true,
            objectDestructuring: false,
            parameter: false,
            propertyDeclaration: true,
            variableDeclaration: false,
            variableDeclarationIgnoreFunction: false,
          },
        ],
      },
    },
  ],
  ignorePatterns: ['.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 11,
    project: ['./tsconfig.json'],
  },
};
