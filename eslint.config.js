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
    'perfectionist/sort-imports': ['error', {
      groups: [
        ['type-builtin', 'value-builtin', 'type-external', 'value-external'],
        ['type-internal', 'value-internal'],
        ['type-parent', 'value-parent', 'type-sibling', 'value-sibling', 'type-index', 'value-index'],
        'side-effect',
        'unknown',
      ],
      newlinesBetween: 1,
      newlinesInside: 0,
      internalPattern: ['^@(app|pages|features|entities|shared)/.+'],
      order: 'asc',
      type: 'natural',
    }],
    'style/semi': ['warn', 'always'],
    'antfu/if-newline': 'off',
    'antfu/top-level-function': 'off',
    'antfu/curly': 'off',
    'curly': ['error', 'multi-line'],
    'unicorn/switch-case-braces': ['error', 'always'],
    'no-nested-ternary': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
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
