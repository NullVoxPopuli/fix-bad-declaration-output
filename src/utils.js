import assert from "node:assert";

import fse from "fs-extra";
import { globby } from "globby";

/**
 * @param {string} contents
 * @param {Array<(contents: string) => string | Promise<string>>} fixers
 */
export async function applyAll(contents, fixers) {
  for (let fixer of fixers) {
    contents = await fixer(contents);
  }

  return contents;
}

/**
 * @param {string} pattern
 */
export async function getFiles(pattern) {
  assert(pattern, `Forgot to pass a glob pattern!`);

  const paths = await globby(pattern);

  return paths;
}

/**
 * @param {string} filePath
 * @param {Array<(contents: string) => string | Promise<string>>} fixers
 */
export async function fixFile(filePath, fixers) {
  let buffer = await fse.readFile(filePath);
  let contents = buffer.toString();
  let fixed = await applyAll(contents, fixers);

  await fse.writeFile(filePath, fixed);
}
