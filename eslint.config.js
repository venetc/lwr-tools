import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: {
    css: true,
  },
  stylistic: {
    braceStyle: '1tbs',
  },
  jsonc: false,
  rules: {
    'no-console': 'off',
    'style/semi': ['warn', 'always'],
    'antfu/if-newline': 'off',
    'antfu/top-level-function': 'off',
    'no-sequences': 'off',
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'SLOT',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: false,
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 2 },
      multiline: { max: 1 },
    }],
  },
});
