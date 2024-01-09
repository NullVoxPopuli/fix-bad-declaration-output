import jscodeshift from "jscodeshift";

const j = jscodeshift.withParser("ts");
const find = `/ <reference types="ember`;

export function fixEmberReferences(contents) {
  const root = j(contents);

  const fixed = root
    .find(j.Comment)
    .filter((path) => path.value.value.startsWith(find))
    .forEach((path) => j(path).remove())
    .toSource();

  return fixed;
}
