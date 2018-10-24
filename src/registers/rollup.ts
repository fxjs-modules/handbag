import { setCompilerForVbox, wrapAsString } from '../vbox'

import moduleList = require('@fibjs/builtin-modules')
import { getRollupOptions } from './_utils';

export const SUFFIX = ['.ts', '.tsx']

export function registerAsRollupedJavascript (vbox, options) {
    const util = require('util')
    const { default: rollup, plugins } = require('fib-rollup');

    const {
        compilerOptions = null, burnout_timeout = 0
    } = options || {}

    const rollupConfig = getRollupOptions(options)

    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => {
            const bundle = util.sync(rollup.rollup, true)({
                input: info.filename,
                external: moduleList,
                plugins: [
                    plugins['rollup-plugin-fibjs-resolve'](),
                    require('rollup-plugin-commonjs')(),
                ],
                ...rollupConfig.bundleConfig
            })

            const { code: rollupedJs } = util.sync(bundle.generate, true)({
                ...rollupConfig.writeConfig,
                output: {
                    format: 'umd',
                    name: rollupConfig.onGenerateUmdName(buf, info),
                    ...rollupConfig.writeConfig.output
                },
            })

            return wrapAsString(rollupedJs)
        },
        burnout_timeout,
        compile_to_iife_script: false
    })
}