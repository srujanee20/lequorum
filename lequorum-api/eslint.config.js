import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                process: 'readonly',
                console: 'readonly'
            }
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
];
