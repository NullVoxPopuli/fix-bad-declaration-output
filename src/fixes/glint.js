import jscodeshift from 'jscodeshift';

import { fixReferences } from './typescript.js';

const j = jscodeshift.withParser('ts');

/**
 * @param {string} contents
 */
export function fixGTSExtensions(contents) {
  const root = j(contents);

  const fixed = root
    .find(j.ImportDeclaration)
    // @ts-expect-error
    .filter((path) => path.node.source.value.includes('.gts'))
    .forEach((path) => {
      // TODO: this may only be appropriate when
      //       moduleResolution = "bundler"
      // @ts-expect-error
      path.node.source.value = path.node.source.value.replace(/\.gts$/, '');
    })
    .toSource();

  return fixed;
}

/**
 * @param {string} contents
 */
export function fixOwnReferences(contents) {
  return fixReferences(contents, {
    types: 'node_modules/@glint',
  });
}
