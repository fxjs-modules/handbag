/// <reference path="../../@types/index.d.ts" />

const fibRollup = require('fib-rollup')

import { parseCommonOptions } from './_utils'
import { isProduction } from '../utils';
import { setCompilerForVbox, wrapAsString } from '../vbox';
import { getRollupOptionsFromRegisterOptions } from './_utils';

import moduleList = require('@fibjs/builtin-modules')

export const SUFFIX = ['.ts', '.jsx', '.tsx']

function _register (asModule: boolean) {
    const default_transpileLib = asModule === true ? false : 'babel'

    return function (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
        const util = require('util')
        const { default: rollup } = require('fib-rollup');

        const {
            burnout_timeout = 0,
            suffix = SUFFIX,
            emitter = null
        } = parseCommonOptions(options) || {}

        const {
            transpileLib = default_transpileLib,
        } = options || {}

        const rollupConfig = getRollupOptionsFromRegisterOptions(options)
        rollupConfig.bundleConfig = rollupConfig.bundleConfig || {}
        rollupConfig.bundleConfig.plugins = rollupConfig.bundleConfig.plugins || getDefaultPlugins(transpileLib)

        if (isProduction())
            rollupConfig.bundleConfig.plugins.push(
                fibRollup.plugins['rollup-plugin-uglify-js']()
            )

        setCompilerForVbox(vbox, {
            suffix,
            compiler: (buf: Class_Buffer, info: any) => {
                const bundle = util.sync(rollup.rollup, true)({
                    input: info.filename,
                    external: moduleList,
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

                return !asModule ? wrapAsString(rollupedJs) : rollupedJs
            },
            burnout_timeout,
            compile_to_iife_script: asModule,
            emitter
        })
    }
}

export const registerReactAsRollupedJavascript = _register(false)
export const registerReactAsModule = _register(true)

export function getDefaultPlugins (transpileLib: false | '' | 'buble' | 'babel' = 'babel') {
    const useBuble = transpileLib === 'buble'
    const useBabel = transpileLib === 'babel'

    const defaultPlugins = [
        fibRollup.plugins['rollup-plugin-fibjs-resolve'](),
        ...useBabel ? [
            fibRollup.plugins['rollup-plugin-babel-standalone']({
                babelrc: false,
                transformConfig: {
                    presets: [
                        ['es2015', { "modules": false }],
                        'es2016', 'es2017', 'react'
                    ]
                }
            })
        ] : [],
        require('rollup-plugin-typescript')({
            lib: ["es5", "es6", "es7", "dom"],
            target: "es5",
            module: 'CommonJS',
            allowJs: true,
            jsx: "react",
            typescript: require('typescript'),
            tslib: require('tslib')
        }),
        ...useBuble ? [require('rollup-plugin-buble')()] : [],
        require('rollup-plugin-commonjs')({
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        })
    ]

    return defaultPlugins
}
