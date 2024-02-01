# fix-bad-declaration-output

Do you have bad declarations?
Is it too hard to fix complex tooling?
(Or do you not have the time to learn how?)

Why fix anything, when we can post-process!

## Usage

### CLI

```bash
npx fix-bad-declaration-output './declarations/**/*.d.ts'
```

### JS

```js
import { fixBadDeclarationOutput } from "fix-bad-declaration-output";

await fixBadDeclarationOutput("./declarations/**/*.d.ts", ["TypeScript#56571", "Glint#628"]);
```

At least one fixer is required to be specified in the second argument.

## Current Fixes

### `/// <reference` removal

See [microsoft/TypeScript#56571](https://github.com/microsoft/TypeScript/issues/56571#issuecomment-1830436576) for details.

You can customize what's removed via:

```js
import { fixBadDeclarationOutput } from "fix-bad-declaration-output";

await fixBadDeclarationOutput(
    "./declarations/**/*.d.ts",
    [
        "TypeScript#56571", // default: type: 'ember'

        // remove anything starting with node_modules.
        // e.g.: /// <reference type="node_modules/...
        ["TypeScript#56571", { types: 'node_modules '}],

        "Glint#628"
        "Glint#697"
    ]
);
```

For removing `/// <reference` entirely, you can configure:

```js
import { fixBadDeclarationOutput } from "fix-bad-declaration-output";

await fixBadDeclarationOutput(
    "./declarations/**/*.d.ts",
    [
        ["TypeScript#56571", { types: 'all '}],
    ]
);
```

#### Removes lines starting with `/// <reference types="ember`

Starting with TS 5.3.x, iirc, ember-source's strategy for shipping public types causes `/// <reference` declarations to be added in libraries.

TypeScript does not tell you why anything happens, and because, in Ember, we can assume the host app will provide the types, we can safely remove these references.

### Rewrite imports ending with `.gts`

In modern tooling, extensions are included in the import paths to help with understanding of what files imports are pointing to, as well as help reduce complexity in build tooling.

See [This Glint Issue](https://github.com/typed-ember/glint/issues/628) as well as some relevant discussion in the [Ember Discord](https://discord.com/channels/480462759797063690/568935504288940056/1171838869914779659) for more details on why a fix hasn't landed in Glint (tl;dr: no one knows what to do)
