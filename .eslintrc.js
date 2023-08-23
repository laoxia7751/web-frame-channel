module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['airbnb-base', 'prettier'],
    globals: {
        document: true,
        localStorage: true,
        window: true,
    },
    rules: {
        'no-irregular-whitespace': 'off',
        'no-console': 'off',
        'guard-for-in': 'off',
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4],
        'no-param-reassign': ['error', { props: false }],
        'no-unused-vars': 'warn',
        'prefer-destructuring': [
            'error',
            {
                array: false,
                object: false,
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        'no-restricted-syntax': 'off',
        'no-prototype-builtins': 'off',
        'no-bitwise': ['error', { int32Hint: true }],
        radix: ['error', 'as-needed'],
        'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    },
    parserOptions: {
        ecmaVersion: 2022,
    },
    parser: 'babel-eslint',
};
