import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import reactConfig from 'eslint-plugin-react/configs/recommended.js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const commonLangOpts = {
  parser: tseslint.parser,
  parserOptions: {
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: import.meta.dirname,
  },
};
const ignores = ['node_modules', '**/dist/**'];

export default tseslint.config(
  {
    ...reactConfig,
    settings: { react: { version: '18.2.0' } },
    files: ['packages/ui/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ignores,
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
    languageOptions: {
      ...commonLangOpts,
      parserOptions: {
        ...reactConfig.languageOptions.parserOptions,
        ...commonLangOpts.parserOptions,
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ignores,
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      prettierConfig,
    ],
    languageOptions: commonLangOpts,
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': 'off', // use ts-ls's feature instead
    },
  },
);
