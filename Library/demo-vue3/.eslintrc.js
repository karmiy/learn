module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'indent': [2, 4, { 'SwitchCase': 1 }],
        'quotes': [2, 'single'], // 单引号
        'vue/html-indent': [2, 4], // Vue 缩进 4 格
        'vue/html-quotes': [2, 'single'], // Vue 模板内属性单引号
    }
}
