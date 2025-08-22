import { stripIndent } from 'common-tags';
import { describe, expect as hardAssert, test } from 'vitest';

import { fixGTSExtensions, fixOwnReferences } from './glint.js';

const expect = hardAssert.soft;

describe('fixGTSExtensions', () => {
  test('works', () => {
    const code = stripIndent`
      import x from './foo.gts';
    `;

    const result = fixGTSExtensions(code);

    expect(result).toBe(`import x from "./foo";`);
  });

  test('works on default exports', () => {
    const code = stripIndent`
      export x from './foo.gts';
    `;

    const result = fixGTSExtensions(code);

    expect(result).toBe(`export x from "./foo";`);
  });

  test('works on named exports', () => {
    const code = stripIndent`
      export { x } from './foo.gts';
    `;

    const result = fixGTSExtensions(code);

    expect(result).toBe(`export { x } from "./foo";`);
  });

  test('works on export star', () => {
    const code = `export * from './component.gts';`;

    const result = fixGTSExtensions(code);

    expect(result).toBe(`export * from "./component";`);
  });

  test('works on inline imports', () => {
    const code = stripIndent`
      import("@ember/component/template-only").TOC<import("./foo.gts").FooSignature>;
    `;

    const result = fixGTSExtensions(code);

    expect(result).toBe(
      `import("@ember/component/template-only").TOC<import("./foo").FooSignature>;`
    );
  });
});

describe('fixOwnReferences', () => {
  test('removes multiple', () => {
    const code = stripIndent`
      /// <reference types="node_modules/@glint/whatever/module">"
      /// <reference types="node_modules/@glint/whatever2/module">"
      /// <reference types="node_modules/@glint/whatever5/module">"
      export const two = 2;`;

    const result = fixOwnReferences(code);

    expect(result).toBe(`export const two = 2;`);
  });

  test(' does not remove more than what is specified', () => {
    const code = stripIndent`
      /// <reference types="@glint/whatever/module">"
      /// <reference types="node_modules/@glint/whatever2/module">"
      export const two = 2;`;

    const result = fixOwnReferences(code);

    expect(result).toBe(stripIndent`
      /// <reference types="@glint/whatever/module">"
      export const two = 2;`);
  });
});
