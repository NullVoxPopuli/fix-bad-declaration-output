import { fixEmberReferences } from "./fixes/ember.js";
import { fixExtensions } from "./fixes/glint.js";

import { getFiles, fixFile } from "./utils.js";

for (let filePath of await getFiles()) {
  await fixFile(filePath, [
    // e.g.: /// <reference types="ember
    fixEmberReferences,
    // e.g.: import './foo.gts'
    fixExtensions,
  ]);
}
