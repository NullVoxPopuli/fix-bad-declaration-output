import { configs } from "@nullvoxpopuli/eslint-configs";

const config = configs.node(import.meta.dirname);

export default [
  ...config,
  {
    files: ["**/*.ts"],
    rules: {
      "n/no-missing-import": "off",
    },
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "n/no-unpublished-import": "off",
    },
  },
];
