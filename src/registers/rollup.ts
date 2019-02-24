/// <reference path="../../@types/index.d.ts" />

import { setCompilerForVbox, wrapAsString } from '../vbox'

import moduleList = require('@fibjs/builtin-modules')
import { getRollupOptionsFromRegisterOptions, parseCommonOptions } from './_utils';

export const SUFFIX = ['.ts', '.tsx']

function _register(asPlainScript = true) {
    return function (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
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
            compiler: (buf: Class_Buffer, info: any) => {
                const bundle = util.sync(rollup.rollup, true)({
                    input: info.filename,
                    external: moduleList,
                    plugins: [
                        plugins['rollup-plugin-fibjs-resolve'](),
                        require('rollup-plugin-commonjs')(),
                    ],
                    ...rollupConfig.bundleConfig
                })

                const { output } = util.sync(bundle.generate, true)({
                    ...rollupConfig.writeConfig,
                    output: {
                        format: 'umd',
                        name: rollupConfig.onGenerateUmdName(buf, info),
                        ...rollupConfig.writeConfig.output
                    }
                })

                const {code: rollupedJs} = output[0]

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
