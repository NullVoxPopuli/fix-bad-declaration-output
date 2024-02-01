'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// accommodates: JS, TS, ESM, and CJS
const config = configs.node();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.test.ts'],
      rules: {
        'n/no-unpublished-import': 'off',
      },
    },
  ],
};
