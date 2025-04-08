import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import formatjs from 'eslint-plugin-formatjs';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { includeIgnoreFile } from '@eslint/compat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      formatjs,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off',
      'formatjs/enforce-id': [
        'error',
        {
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
        },
      ],
    },
  },
]);
