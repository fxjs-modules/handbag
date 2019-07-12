
v0.2.8 / 2019-07-12
==================

  * upgrade dependencies
  * feat: in nirvana mode, only re-require when module's md5 changed.
  * stop support pack .jsx by buble.

v0.2.7 / 2019-02-25
===================

  * Release v0.2.7
  * upgrade dependencies, adapt fib-rollup v0.4.0(due to its dependency on rollup v1 rather v0.66.x)
  * robust.
  * little fix.
  * code, doc clean.
  * support react register.
  * migrate LICENSE to MIT

v0.2.6 / 2019-01-20
===================

  * Release v0.2.6
  * specify uglify-js as dependency and adjust it.

v0.2.5 / 2019-01-20
===================

  * Release v0.2.5
  * typo fix.
  * typo and doc fix.

v0.2.4 / 2019-01-11
===================

  * Release v0.2.4
  * support graphql register.
  * add examples/vue-todo.
  * typo fix.
  * upgrade .npmignore

v0.2.3 / 2019-01-03
===================

  * Release v0.2.3
  * add ts/buble/stylus example about riot register.
  * robust about nirvana option.
  * add examples/riot-todo
  * add typo.
  * add `riot.registerRiotAsJs`
  * code clean.
  * upgrade fib-typify.

v0.2.2 / 2018-11-25
===================

  * Release v0.2.2
  * upgrade dependencies.
  * fix file symbol problem, add appveyor ci config yml.
  * add register:registerStylusAsRenderer
  * [register:rollup] support emitter
  * code clean
  * upgrade dependencies, better test cases.

v0.2.1 / 2018-11-12
===================

  * Release v0.2.1
  * support nirvana style burnout_timeout
  * [README.md] add content about hooks

v0.2.0 / 2018-11-08
===================

  * Release v0.2.0
  * support 'hooks' for all registers.

v0.1.4 / 2018-11-07
===================

  * Release v0.1.4
  * add .editorconfig
  * [register.pug] fix share to mutable compilerOptions in testcase; fix lack of assign for 'filename' option in `registerPugAsHtml`; support 'basedir' option.

v0.1.3 / 2018-11-06
===================

  * Release v0.1.3
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
