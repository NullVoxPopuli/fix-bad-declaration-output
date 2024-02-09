import { stripIndent } from 'common-tags';
import { describe, expect as hardAssert, test } from 'vitest';

import { fixReferences } from './typescript.js';

const expect = hardAssert.soft;

describe('fixReferences', () => {
  test('defaults: match everything', () => {
    let code = stripIndent`
      /// <reference types="ember-source/whatever/module">
      /// <reference types="everything">
      /// <reference types="another">
      export const two = 2;`;

    let result = fixReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test('defaults: match multiple ember-source', () => {
    let code = stripIndent`
      /// <reference types="ember-source/whatever/module">
      /// <reference types="ember-source/whatever1/module">
      /// <reference types="ember-source/whatever2/module">
      export const two = 2;`;

    let result = fixReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test('custom: works', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module">
      export const two = 2;`;

    let result = fixReferences(code, { types: '@glint' });

    expect(result).toBe(`export const two = 2;`);
  });

  test('custom: removes multiple', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module">
      /// <reference types="@glint/whatever2/module">
      /// <reference types="@glint/whatever5/module">
      export const two = 2;`;

    let result = fixReferences(code, { types: '@glint' });

    expect(result).toBe(`export const two = 2;`);
  });

  test('custom: does not remove more than what is specified', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module"
      /// <reference types="node_modules/@glint/whatever2/module">
      export const two = 2;`;

    let result = fixReferences(code, { types: '@glint' });

    expect(result).toBe(stripIndent`
      /// <reference types="node_modules/@glint/whatever2/module">
      export const two = 2;`);
  });

  test('can remove everything', () => {
    let code = stripIndent`
      /// <reference types="@glint/whatever/module">
      /// <reference types="node_modules/@glint/whatever2/module">
      /// <reference types="xyz">
      export const two = 2;`;

    let result = fixReferences(code, { types: 'all' });

    expect(result).toBe(`export const two = 2;`);
  });

  describe('https://github.com/machty/ember-concurrency/issues/564', () => {

    test('declarations/helpers/cancel-all.d.ts', () => {
      let code = stripIndent`
        /// <reference types="ember-source/types/preview/@ember/component/-private/signature-utils" />
        /// <reference types="ember-source/types/preview/@ember/component/helper" />
        import type { Task } from '../index';
        type CancelAllParams = [task: Task<any, any[]>];
        export declare function cancelHelper(args: CancelAllParams): (...innerArgs: any[]) => any;
        declare const _default: import("@ember/component/helper").FunctionBasedHelper<{
            Args: {
                Positional: CancelAllParams;
                Named: import("@ember/component/helper").EmptyObject;
            };
            Return: (...innerArgs: any[]) => any;
        }>;
        export default _default;
      `;

      let result = fixReferences(code);

      expect(result).toMatchInlineSnapshot(`
        "import type { Task } from '../index';
        type CancelAllParams = [task: Task<any, any[]>];
        export declare function cancelHelper(args: CancelAllParams): (...innerArgs: any[]) => any;
        declare const _default: import("@ember/component/helper").FunctionBasedHelper<{
            Args: {
                Positional: CancelAllParams;
                Named: import("@ember/component/helper").EmptyObject;
            };
            Return: (...innerArgs: any[]) => any;
        }>;
        export default _default;"
      `);
    });
  })
  test('declarations/-private/ember-environment.d.ts', () => {
    let code = stripIndent`
      export class EmberEnvironment extends Environment {
          assert(...args: any[]): void;
          reportUncaughtRejection(error: any): void;
          defer(): any;
          globalDebuggingEnabled(): any;
      }
      export const EMBER_ENVIRONMENT: EmberEnvironment;
      import { Environment } from './external/environment';
    `;

    let result = fixReferences(code);

    expect(result).toMatchInlineSnapshot(`
      "export class EmberEnvironment extends Environment {
          assert(...args: any[]): void;
          reportUncaughtRejection(error: any): void;
          defer(): any;
          globalDebuggingEnabled(): any;
      }
      export const EMBER_ENVIRONMENT: EmberEnvironment;
      import { Environment } from './external/environment';"
    `);
  });
});
