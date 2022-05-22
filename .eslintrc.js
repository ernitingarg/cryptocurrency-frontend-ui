module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react-hooks',
    'react',
    'material-ui',
    'react-perf',
    'optimize-regex',
    'promise',
    'security',
  ],
  extends: [
    'eslint:recommended',
    'plugin:you-dont-need-momentjs/recommended',
    'plugin:security/recommended',
    'plugin:react-perf/all',
    'plugin:react/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:@typescript-eslint/recommended',
    // TypeScriptでチェックされる項目を除外する設定
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:promise/recommended',
  ],
  rules: {
    'require-await': 2,
    'material-ui/ignore-before-comment': 2,
    'no-await-in-loop': 2,
    'optimize-regex/optimize-regex': 'warn',
    // "material-ui/no-hardcoded-labels": 2,
    // "material-ui/restricted-path-imports": 2,
    'import/namespace': 0,
    'import/no-cycle': 0,
    'import/no-deprecated': 0,
    'no-unused-vars': 0,
    'no-console': 0,
    'no-array-constructor': 0,
    'no-use-before-define': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-vars': 1,
    'react/prop-types': 0,
    'react/display-name': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // https://github.com/typescript-eslint/typescript-eslint/pull/1175/files#diff-c3c73d768c69182103b7f30c8a648beb
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-use-before-define': 2,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/no-inferrable-types': 1,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        args: 'none',
      },
    ],
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-array-constructor': 2,
    '@typescript-eslint/adjacent-overload-signatures': 2,
    '@typescript-eslint/no-namespace': [
      2,
      {
        allowDeclarations: true,
      },
    ],
    '@typescript-eslint/prefer-namespace-keyword': 2,
    // '@typescript-eslint/no-require-imports': 2,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-triple-slash-reference': 0,
    'react-perf/jsx-no-new-object-as-prop': 1,
    'react-perf/jsx-no-new-function-as-prop': 1,
    // ES2019 available in TypeScript
    'node/no-unsupported-features/es-syntax': 0,
    // allow special triple slashes comment: "/// <reference />"
    'spaced-comment': [
      2,
      'always',
      {
        line: {
          markers: ['/'],
        },
        block: {
          balanced: true,
        },
      },
    ],
    'prettier/prettier': 'error',
  },
};
