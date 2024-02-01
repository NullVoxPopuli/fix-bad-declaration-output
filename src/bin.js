#!/usr/bin/env node
import assert from 'node:assert';

import { fixEmberReferences } from './fixes/ember.js';
import * as glint from './fixes/glint.js';
import { fixFile, getFiles } from './utils.js';

const [, , ...args] = process.argv;
const [pattern] = args;

assert(typeof pattern === 'string', 'Please pass a glob pattern to `fix-bad-declaration-output`');

for (let filePath of await getFiles(pattern)) {
  await fixFile(filePath, [
    // e.g.: /// <reference types="ember
    fixEmberReferences,
    // e.g.: import './foo.gts'
    glint.fixGTSExtensions,
    // e.g.: /// <reference type="node_modules/@glint
    glint.fixOwnReferences,
  ]);
}
