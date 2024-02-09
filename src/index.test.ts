import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { stripIndent } from 'common-tags';
import { describe, expect as hardAssert, test } from 'vitest';

import { fixBadDeclarationOutput } from './index.js';

const expect = hardAssert.soft;

async function mkdirp() {
  const tmpDir = os.tmpdir();
  const tmpPath = path.join(tmpDir, 'fix-bad-declaration-output');
  const suffix = crypto.randomBytes(16).toString('hex').slice(0, 16);
  const fullPath = path.join(tmpPath, `test-${suffix}`);

  await fs.mkdir(fullPath, { recursive: true });

  return fullPath;
}

async function read(filePath: string) {
  let buffer = await fs.readFile(filePath);

  return buffer.toString();
}

describe('fixBadDeclarationOutput', () => {
  test('it works', async () => {
    let tmp = await mkdirp();

    let a = path.join(tmp, 'a.d.ts');

    await fs.writeFile(
      a,
      stripIndent`
      /// <reference types="@glint/whatever/module">
      /// <reference types="node_modules/@glint/whatever2/module">
      /// <reference types="xyz">

      export declare const two: number;
      export declare const three: string;
      export declare const four: 'literal';
    `
    );

    await fixBadDeclarationOutput(`${tmp}/**/*.d.ts`, [['TypeScript#56571', { types: 'all' }]], {
      log: true,
    });

    let aContents = await read(a);

    expect(aContents).toMatchInlineSnapshot(`
      "export declare const two: number;
      export declare const three: string;
      export declare const four: 'literal';"
    `);
  });
});
