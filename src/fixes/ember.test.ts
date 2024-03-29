import { stripIndent } from 'common-tags';
import { describe, expect as hardAssert, test } from 'vitest';

import { fixEmberReferences } from './ember.js';

const expect = hardAssert.soft;

describe('fixReferences', () => {
  test('match ember-source', () => {
    let code = stripIndent`
      /// <reference types="ember-source/whatever/module">"
      export const two = 2;`;

    let result = fixEmberReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test('match multiple ember-source', () => {
    let code = stripIndent`
      /// <reference types="ember-source/whatever/module">"
      /// <reference types="ember-source/whatever1/module">"
      /// <reference types="ember-source/whatever2/module">"
      export const two = 2;`;

    let result = fixEmberReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test('ignore non-specified', () => {
    let code = stripIndent`
      /// <reference types="not-ember-source/whatever/module">"
      export const two = 2;`;

    let result = fixEmberReferences(code);

    expect(result).toBe(code);
  });
});
