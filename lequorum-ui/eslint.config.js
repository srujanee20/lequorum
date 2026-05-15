import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx}'],
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite
        ],
        languageOptions: {
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        rules: {
            'no-unused-vars': 'off',
            'indent': ['warn', 4],
            'semi': ['warn', 'always'],
            'comma-dangle': ['error', 'never'],
            'space-before-function-paren': ['error', {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always'
            }]
        }
    }
]);
