import { setCompilerForVbox, wrapAsString } from '../vbox'

import moduleList = require('@fibjs/builtin-modules')
import { getRollupOptionsFromRegisterOptions, parseCommonOptions } from './_utils';

export const SUFFIX = ['.ts', '.tsx']

/**
 * @deprecated
 * @param vbox
 * @param options
 */
export function _register(asPlainScript = true) {
    return function (vbox, options) {
        const util = require('util')
        const { default: rollup, plugins } = require('fib-rollup');

		const {
			burnout_timeout = 0,
			suffix = SUFFIX,
			emitter = null
		} = parseCommonOptions(options) || {}

        const rollupConfig = getRollupOptionsFromRegisterOptions(options)

        setCompilerForVbox(vbox, {
            suffix,
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

                return asPlainScript ? wrapAsString(rollupedJs) : rollupedJs
            },
            burnout_timeout,
            compile_to_iife_script: !asPlainScript,
			emitter
        })
    }
}

export const registerAsPlainJavascript = _register(true)
export const registerAsRollupedJavascript = registerAsPlainJavascript
export const registerAsModule = _register(false)
