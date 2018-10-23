import { setCompilerForVbox, wrapAsString } from '../vbox'

import moduleList = require('@fibjs/builtin-modules')

export const SUFFIX = ['.ts', '.tsx']

export function registerAsRollupedJavascript (vbox, options) {
    const util = require('util')
    const { default: rollup, plugins } = require('fib-rollup');

    const { compilerOptions = null, burnout_timeout = 0,
        rollup: rollupConfig = {},
        onGenerateUmdName = (buf, info) => 'UmdModule'
    } = options || {}

    const {
        bundleConfig = {},
        outputConfig = {}
    } = rollupConfig || {}

    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => {
            const bundle = util.sync(rollup.rollup, true)({
                input: info.filename,
                external: moduleList,
                plugins: [
                    plugins['rollup-plugin-fibjs-resolve'](),
                    require('rollup-plugin-commonjs')()
                ],
                ...bundleConfig
            })

            const { code: rollupedJs } = util.sync(bundle.generate, true)({
                output: {
                    name: onGenerateUmdName(buf, info),
                    format: 'umd',
                },
                ...outputConfig,
            })

            return wrapAsString(rollupedJs)
        },
        burnout_timeout,
        compile_to_script: false
    })
}