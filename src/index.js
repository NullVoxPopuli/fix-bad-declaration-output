import assert from 'node:assert';

import { issues } from './fixes/index.js';
import { fixFile, getFiles } from './utils.js';

/**
 * @typedef {import('./types.js').Issue} Issue
 * @typedef {import('./types.js').FixerPair<any>} FixerPair
 * @typedef {import('./types.js').IssueFunction} IssueFunction
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
 * @param {import('./types.js').Fixes} fixes
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

  /** @type {IssueFunction[]} */
  const fixesToApply = [];
  /** @type {string[]} */
  const names = [];

  for (const requestedFix of fixes) {
    const requested = Array.isArray(requestedFix) ? requestedFix : [requestedFix, {}];

    /** @type {Issue} */
    const name = requested[0];
    const fixOptions = requested[1];

    /** @type {IssueFunction} */
    const fixer = issues[name];

    assert(fixer, `Could not find fixer with name ${name}.`);

    /**
     * @param {string} contents
     */
    const withOptions = (contents) => fixer(contents, fixOptions);

    names.push(name);
    fixesToApply.push(withOptions);
  }

  const files = await getFiles(glob);

  if (options.log) {
    console.info(
      `Applying fixes, ${names.join(', ')}, to ${files.length} files matching '${glob}' ...`
    );
  }

  for (const filePath of files) {
    try {
      await fixFile(filePath, fixesToApply);
    } catch (e) {
      console.error(`Errored while processing ${filePath}`);
      throw e;
    }
  }
}
