import { fixReferences } from './typescript.js';

const defaultFind = 'ember';

/**
 * @param {string} contents
 * @param {{ types?: string }} [ options ]
 */
export function fixEmberReferences(contents, options = {}) {
  return fixReferences(contents, {
    types: options.types || defaultFind,
  });
}
