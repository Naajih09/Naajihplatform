// apps/admin-web/.eslintrc.cjs
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginReact from 'eslint-plugin-react'; // NEW: Import the full react plugin

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // Spread recommended configs
      ...pluginReact.configs.recommended, // NEW: Add React recommended config
      reactHooks.configs.recommended, // Using flat config recommended
      reactRefresh.configs.recommended, // Using flat config recommended
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module', // Essential for ES modules and React components
      parser: tseslint.parser, // Specify the parser
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Ensure this points to your project's tsconfig
      },
      globals: {
        ...globals.browser,
        // Add specific global variables if needed, e.g., for Vite
        // process: 'readonly', // If you're using process.env, though Vite prefers import.meta.env
      },
    },
    plugins: {
      react: pluginReact, // NEW: Register the react plugin
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect', 
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off', 

      'react/forbid-dom-props': ['warn', { forbid: ['style'] }], // This will warn on `style={{...}}` on DOM elements

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
  },
]);