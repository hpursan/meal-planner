module.exports = {
    extends: ['expo', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off', // Allow logs for MVP
    },
    ignorePatterns: ['/dist/*', '/node_modules/*'],
    env: {
        jest: true,
        browser: true,
        node: true,
    },
};
