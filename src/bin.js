#!/usr/bin/env node
import assert from 'node:assert';

import * as glint from './fixes/glint.js';
import * as ts from './fixes/typescript.js';
import { fixFile, getFiles } from './utils.js';

const [, , ...args] = process.argv;
const [pattern] = args;

assert(typeof pattern === 'string', 'Please pass a glob pattern to `fix-bad-declaration-output`');

for (let filePath of await getFiles(pattern)) {
  await fixFile(filePath, [
    // e.g.: /// <reference types="ember
    ts.fixReferences,
    // e.g.: import './foo.gts'
    glint.fixGTSExtensions,
    // e.g.: /// <reference type="node_modules/@glint
    glint.fixOwnReferences,
  ]);
}
