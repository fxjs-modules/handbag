
v0.1.3 / 2018-11-06
==================

  * fix lack of support to 'options.suffx' for some compilers.

v0.1.2 / 2018-11-06
===================

  * Release v0.1.2
  * code clean.
  * fix vue.registerVueAsRollupedJavascript's option key 'tranpileLib' to 'transpileLib'
  * add registers.rollup.registerAsModule, fix README.md

v0.1.1 / 2018-10-28
===================

  * Release v0.1.1
  * [register:stylus] better render process.
  * [register:vue] allow transpile with `buble`

v0.1.0 / 2018-10-25
===================

  * Release v0.1.0
  * [README.md] add API about vue register.
  * [breakchange]     - rename registerOption's `compile_to_script` to `compile_to_iife_script`;     - move `registerOption.onGenerateUmdName` -> `registerOption.rollup.onGenerateUmdName`     - separate `registerOption.rollup` ->         - `registerOption.rollup.bundleConfig`         - `registerOption.rollup.outputConfig` [new register]     - vue
  * [breakchange] register:`rollup.registerAsRollupedJavascript`'s option rollup -> bundleConfig, outputConfig
  * little robust change.

v0.0.3 / 2018-10-23
===================

  * Release v0.0.3
  * safer 'wrapAsString'

v0.0.2 / 2018-10-23
===================

  * Release v0.0.2
  * dependencies fix.

v0.0.1 / 2018-10-23
===================

  * Release v0.0.1
  * add 'test' to .npmignore
  * test case use `fibRollup.plugins['rollup-plugin-babel-standalone']`.
  * update README.md
  * add application test case frontend-server.
  * test case fix.
  * add register:typescript && register:rollup.
  * [README.md] add API `image.registerImageAsBase64`
  * [README.md] add License block
  * [register:pug]add test cases about block `extend/include`.
  * fix lack of runtime-utils for pug register whatever its compiler option 'inlineRuntimeFunctions' is (true/false)
  * add register for image-type files.
  * Init.
