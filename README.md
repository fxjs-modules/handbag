# 👝 @fxjs/handbag

[![Build Status](https://travis-ci.org/fxjs-modules/handbag.svg)](https://travis-ci.org/fxjs-modules/handbag)
[![NPM version](https://img.shields.io/npm/v/@fxjs/handbag.svg)](https://www.npmjs.org/package/@fxjs/handbag)

## Pre-requisite

- `fibjs >= 0.26.0`

## Usage

`npm install @fxjs/handbag`

### Sample

register one compiler for `.pug` file

```javascript
const fxHandbag = require('@fxjs/handbag')

const fpug = require('fib-pug')
function registerPugAsHtml (vbox) {
    const compilerOptions = {
        filters: {
            typescript: require('jstransformer-typescript').render,
            stylus: require('jstransformer-stylus').render,
        }
    }

    fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
        suffix: '.pug',
        compiler: (buf, info) => fxHandbag.vboxUtils.wrapAsString(
            fpug.renderFile(info.filename, compilerOptions)
        )
    })
}

const vm = require('vm')

vbox = new vm.SandBox(moduleHash)
registerPugAsHtml(vbox)

// just require one pug as rendered html string
const renderedHtml = vbox.require('./test.pug', __dirname)
```

you can also do like this:

```javascript
const compilerOptions = {
    filters: {
        typescript: require('jstransformer-typescript').render,
        stylus: require('jstransformer-stylus').render,
    }
}

const vbox = new vm.SandBox(moduleHash)
fxHandbag.registers.pug.registerPugAsHtml(vbox, { compilerOptions })

const renderedHtml = vbox.require('./test.pug', __dirname)
```

## APIs

### vboxUtils

`vboxUtils` is some basic operation for one vbox generated by `new vm.SandBox(...)`

`setCompilerForVbox(vbox: Class_SandBox, options: {suffix: string|string[], compiler: Function, burnout_timeout?: number})`
---

set one `compiler` function for `vbox`, the `compiler` is used for [`vbox.setModuleCompiler`].

### registers

#### Common Option

register functions support options below:

```javascript
{
    // compilerOptions passed to render of register.
    compilerOptions: {...},
    // timeout that module keep required file id, if it is 0, keep module always
    burnout_timeout: {...}
}
```

plain.registerAsPlain(vbox, options)
---
- options.suffix: default `['.txt']`

register compiler to require file as its plain text

pug.registerPugAsRender(vbox, options)
---
- options.suffix: default `['.pug', '.jade']`

register compiler to require pug file as pug renderer

pug.registerPugAsHtml(vbox, options)
---
- options.suffix: default `['.pug', '.jade']`

register compiler to require pug file as rendered html

stylus.registerStylusAsCss(vbox, options)
---
- options.suffix: default `['.styl', '.stylus']`

register compiler to require stylus file as rendered html


## Others

### burnout_timeout

In some cases, we want vbox to remove required module by ID after `burnout_timeout`.

For example, you are developing one website's user profile page, which rendered from `path/user-profile.pug`, you serve it with `http.Server` and `mq.Routing`, and require the pug file as `require('path/user-profile.pug', __dirname)` with special vbox generated by registers in `@fxjs/handbag` or by your own manual registering. You change the pug file, then you wish the next calling to `require('path/user-profile.pug', __dirname)` would return the latest file resource. So, you need remove the required content every other times(such as 300ms), which is `burnout_timeout`.

All reigsters's option in `@fxjs/handbag` supports `burnout_timeout` option : )

[`vbox.setModuleCompiler`]:http://fibjs.org/docs/manual/object/ifs/sandbox.md.html#setModuleCompiler