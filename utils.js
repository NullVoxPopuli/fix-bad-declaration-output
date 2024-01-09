import fse from "fs-extra";
import { globby } from "globby";

export async function applyAll(contents, fixers) {
  for (let fixer of fixers) {
    contents = await fixer(contents);
  }

  return contents;
}

export async function getFiles() {
  const [_program, _script, ...args] = process.argv;

  const [pattern] = args;

  const paths = await globby(pattern);

  return paths;
}

export async function fixFile(filePath, fixers) {
  let buffer = await fse.readFile(filePath);
  let contents = buffer.toString();
  let fixed = await applyAll(contents, fixers);

  await fse.writeFile(filePath, fixed);
}
