import jscodeshift from 'jscodeshift';

const j = jscodeshift.withParser('ts');

const defaultFind = 'ember';

/**
 * @param {string} contents
 * @param {{ types?: string | 'all' }} [ options ]
 */
export function fixReferences(contents, options = {}) {
  const root = j(contents);
  const find =
    options.types === 'all'
      ? `/ <reference types=`
      : `/ <reference types="${options.types || defaultFind}`;

  const fixed = root
    // @ts-expect-error
    .find(j.Comment)
    // @ts-expect-error
    .filter((path) => path.value.value.startsWith(find))
    // @ts-expect-error
    .forEach((path) => j(path).remove())
    .toSource();

  return fixed;
}
