import { setCompilerForVbox, wrapAsString } from '../vbox'

export const SUFFIX = ['.ts', '.tsx']

export function registerAsRollupedJavascript (vbox, options) {
    const util = require('util')
    const { default: rollup, plugins } = require('fib-rollup');

    const { compilerOptions = null, burnout_timeout = 0,
        rollupConfig = {},
        onGenerateUmdName = (buf, info) => 'UmdModule'
    } = options || {}

    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => {
            const bundle = util.sync(rollup.rollup, true)({
                input: info.filename,
                external: ['coroutine'],
                plugins: [
                    plugins['rollup-plugin-fibjs-resolve'](),
                    require('rollup-plugin-commonjs')()
                ],
                ...rollupConfig
            })

            const { code: rollupedJs } = util.sync(bundle.generate, true)({
                output: {
                    name: onGenerateUmdName(buf, info),
                    format: 'umd',
                },
                ...rollupConfig,
            })

            return wrapAsString(rollupedJs)
        },
        burnout_timeout,
        compile_to_script: false
    })
}