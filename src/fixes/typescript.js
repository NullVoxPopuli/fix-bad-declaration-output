import jscodeshift from 'jscodeshift';

const j = jscodeshift.withParser('ts');

/**
 * @param {string} contents
 * @param {{ types?: string | 'all' }} [ options ]
 */
export function fixReferences(contents, options = {}) {
  const root = j(contents);
  const removeAll = !options.types || options.types === 'all';
  const find = removeAll ? `/ <reference types=` : `/ <reference types="${options.types}`;

  root
    // @ts-expect-error
    .find(j.Comment)
    // @ts-expect-error
    .filter((path) => path.value.value.startsWith(find))
    // @ts-expect-error
    .forEach((path) => j(path).remove());

  return root.toSource();
}
