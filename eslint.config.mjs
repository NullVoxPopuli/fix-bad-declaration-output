import { configs } from '@nullvoxpopuli/eslint-configs';

const config = configs.node(import.meta.dirname);

export default [
  ...config,
  // your modifications here
  // see: https://eslint.org/docs/user-guide/configuring/configuration-files#how-do-overrides-work
  {
    files: ['**/*.test.ts'],
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
];
