/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/naming-convention": "warn",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    }
  },
);