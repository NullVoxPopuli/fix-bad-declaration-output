import assert from "node:assert";

import { fixEmberReferences } from "./fixes/ember.js";
import { fixExtensions } from "./fixes/glint.js";

import { getFiles, fixFile } from "./utils.js";

const [_program, _script, ...args] = process.argv;
const [pattern] = args;

assert(
  typeof pattern === "string",
  "Please pass a glob pattern to `fix-bad-declaration-output`",
);

for (let filePath of await getFiles(pattern)) {
  await fixFile(filePath, [
    // e.g.: /// <reference types="ember
    fixEmberReferences,
    // e.g.: import './foo.gts'
    fixExtensions,
  ]);
}
