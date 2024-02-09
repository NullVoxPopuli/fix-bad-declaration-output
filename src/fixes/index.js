import * as glint from './glint.js';
import { fixReferences } from './typescript.js';

export const issues = {
  /**
   * https://github.com/microsoft/TypeScript/issues/56571#issuecomment-1830436576
   */
  'TypeScript#56571': fixReferences,
  /**
   * https://github.com/typed-ember/glint/issues/628
   */
  'Glint#628': glint.fixGTSExtensions,
  /**
   * https://github.com/typed-ember/glint/issues/697
   */
  'Glint#697': glint.fixOwnReferences,
}; /** @type {const} */
