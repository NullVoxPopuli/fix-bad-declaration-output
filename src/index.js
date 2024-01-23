import assert from 'node:assert';

import { issues } from './fixes/index.js';
import { fixFile, getFiles } from './utils.js';

/**
 * @typedef {typeof issues} IssuesMap
 * @typedef {keyof IssuesMap} Issue
 */

/**
 * @typedef {[Key, IssuesMap[Key]]} FixerPair<Key>
 * @template {Issue} Key
 */

/**
 * @type {Issue[]}
 */
const DEFAULT_FIXES = ['TypeScript#56571'];
const DEFAULT_GLOB = 'declarations/**/*.d.ts';
const DEFAULT_OPTIONS = {
  log: true,
};

/**
 * @param {string} glob
 * @param {Issue[]} fixes
 */
export async function fixBadDeclarationOutput(
  glob = DEFAULT_GLOB,
  fixes = DEFAULT_FIXES,
  options = DEFAULT_OPTIONS
) {
  assert(
    glob,
    `First argument to 'fixBadDeclarationOutput' is missing. Please pass a glob pattern as teh first argument.`
  );
  assert(
    fixes,
    `List of fixes missing for 'fixBadDeclarationOutput'. Please specify the 'fixes' for the second arg.`
  );

  /** @type {Array<IssuesMap[Issue]>} */
  let fixesToApply = [];
  /** @type {string[]} */
  let names = [];

  for (let requestedFix of fixes) {
    let requested = Array.isArray(requestedFix) ? requestedFix : [requestedFix, {}];

    /** @type {Issue} */
    let name = requested[0];
    let fixOptions = requested[1];

    /** @type {IssuesMap[Issue]} */

    let fixer = issues[name];

    assert(fixer, `Could not find fixer with name ${name}.`);

    /**
     * @param {string} contents
     */
    let withOptions = (contents) => fixer(contents, fixOptions);

    fixesToApply.push(withOptions);
  }

  let files = await getFiles(glob);

  if (options.log) {
    console.info(`Applying fixes, ${names.join(', ')}, to ${files.length} files...`);
  }

  for (let filePath of files) {
    await fixFile(filePath, fixesToApply);
  }
}
