import { stripIndent } from 'common-tags';
import { describe, expect as hardAssert, test } from 'vitest';

import { fixReferences } from './typescript.js';

const expect = hardAssert.soft;

describe('fixReferences', () => {
  test('defaults: match ember-source', () => {
    let code = stripIndent`
      /// <reference types="ember-source/whatever/module">"
      export const two = 2;`;

    let result = fixReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test('defaults: match multiple ember-source', () => {
    let code = stripIndent`
      /// <reference types="ember-source/whatever/module">"
      /// <reference types="ember-source/whatever1/module">"
      /// <reference types="ember-source/whatever2/module">"
      export const two = 2;`;

    let result = fixReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test('defaults: ignore non-specified', () => {
    let code = stripIndent`
      /// <reference types="not-ember-source/whatever/module">"
      export const two = 2;`;

    let result = fixReferences(code);

    expect(result).toBe(code);
  });

  test('custom: works', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module">"
      export const two = 2;`;

    let result = fixReferences(code, { types: '@glint' });

    expect(result).toBe(`export const two = 2;`);
  });

  test('custom: removes multiple', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module">"
      /// <reference types="@glint/whatever2/module">"
      /// <reference types="@glint/whatever5/module">"
      export const two = 2;`;

    let result = fixReferences(code, { types: '@glint' });

    expect(result).toBe(`export const two = 2;`);
  });

  test('custom: does not remove more than what is specified', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module">"
      /// <reference types="node_modules/@glint/whatever2/module">"
      export const two = 2;`;

    let result = fixReferences(code, { types: '@glint' });

    expect(result).toBe(stripIndent`
      /// <reference types="node_modules/@glint/whatever2/module">"
      export const two = 2;`);
  });
});
