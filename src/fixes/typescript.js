/**
 * See: original code for withParser('ts')
 *
 * https://github.com/facebook/jscodeshift/blob/e877ed287dcb3ef3ee8b20c53ec8b477ab564438/parser/ts.js
 */
import babylon from '@babel/parser';
import jscodeshift from 'jscodeshift';

function customTSParser() {
  /**
   * https://github.com/facebook/jscodeshift/blob/e877ed287dcb3ef3ee8b20c53ec8b477ab564438/parser/tsOptions.js
   */
  const options = {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: true,
    plugins: [
      'asyncGenerators',
      'decoratorAutoAccessors',
      'bigInt',
      'classPrivateMethods',
      'classPrivateProperties',
      'classProperties',
      'decorators-legacy',
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportExtensions',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importAttributes',
      'importMeta',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      ['pipelineOperator', { proposal: 'minimal' }],
      'throwExpressions',
      /**
       * Without dts: true, we don't properly parse all types of declaration files
       *
       * This is missing from the official tsOptions in jscodeshift
       */
      ['typescript', { dts: true }],
    ],
  };

  return {
    /**
     * @param {string} code
     */
    parse(code) {
      return babylon.parse(code, options);
    },
  };
}

const j = jscodeshift.withParser(customTSParser());

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
