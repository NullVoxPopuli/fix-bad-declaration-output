import jscodeshift from "jscodeshift";

const j = jscodeshift.withParser("ts");

export function fixExtensions(contents) {
  const root = j(contents);

  const fixed = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value.includes(".gts"))
    .forEach((path) => {
      // TODO: this may only be appropriate when
      //       moduleResolution = "bundler"
      path.node.source.value = path.node.source.value.replace(/\.gts$/, "");
    })
    .toSource();

  return fixed;
}
