import fibRollup = require('fib-rollup')

import { parseCommonOptions, makeHookPayload } from './_utils'
import { isProduction } from '../utils';
import { setCompilerForVbox, wrapAsString } from '../vbox';
import { getRollupOptionsFromRegisterOptions } from './_utils';

import moduleList = require('@fibjs/builtin-modules')

export const SUFFIX = ['.vue']

const DEFAULT_ROLLUP_PLUGIN_VUE_OPTS = {
    template: {
        isProduction: true
    }
}

function _register (asModule) {
    const default_transpileLib = asModule === true ? false : 'babel'
    
    return function (vbox, options) {
        const util = require('util')
        const { default: rollup } = require('fib-rollup');

        const {
            burnout_timeout = 0,
            suffix = SUFFIX,
            emitter = null
        } = parseCommonOptions(options) || {}

        const {
            rollupPluginVueOptions = DEFAULT_ROLLUP_PLUGIN_VUE_OPTS,
            tranpileLib = undefined, /* for historical mistake */
            transpileLib = tranpileLib || default_transpileLib,
        } = options || {}

        const rollupConfig = getRollupOptionsFromRegisterOptions(options)
        rollupConfig.bundleConfig = rollupConfig.bundleConfig || {}
        rollupConfig.bundleConfig.plugins = rollupConfig.bundleConfig.plugins || getDefaultPlugins(rollupPluginVueOptions, transpileLib)

        if (isProduction())
            rollupConfig.bundleConfig.plugins.push(
                fibRollup.plugins['rollup-plugin-uglify-js']()
            )

        setCompilerForVbox(vbox, {
            suffix,
            compiler: (buf, info) => {
                const bundle = util.sync(rollup.rollup, true)({
                    input: info.filename,
                    external: moduleList,
                    ...rollupConfig.bundleConfig
                })

                const { code: rollupedJs } = util.sync(bundle.generate, true)({
                    ...rollupConfig.writeConfig,
                    output: {
                        format: 'umd',
                        name: rollupConfig.onGenerateUmdName(buf, info),
                        ...rollupConfig.writeConfig.output
                    }
                })

                return !asModule ? wrapAsString(rollupedJs) : rollupedJs
            },
            burnout_timeout,
            compile_to_iife_script: asModule,
            emitter
        })
    }
}

export const registerVueAsRollupedJavascript = _register(false)
export const registerVueAsComponentOptions = _register(true)

function getRequireVBox () {
    return fibRollup.getCustomizedVBox({
        prettier: {
            format: c => c
        }
    })
}

export function getRollupPluginVue () {
    const rollupPluginRequireVbox = getRequireVBox()
    return rollupPluginRequireVbox.require('rollup-plugin-vue', __dirname).default
}

export function getDefaultPlugins (rollupPluginVueOptions = {}, tranpileMode: '' | 'buble' | 'babel' = 'babel') {
    const rollupPluginVue = getRollupPluginVue()
    const useBuble = tranpileMode === 'buble'
    const useBabel = tranpileMode === 'babel'

    const defaultPlugins = [
        rollupPluginVue(rollupPluginVueOptions),
        fibRollup.plugins['rollup-plugin-fibjs-resolve'](),
        ...useBabel ? [
            fibRollup.plugins['rollup-plugin-babel-standalone']({
                transformConfig: {
                    presets: [
                        ['es2015', { "modules": false }],
                        'es2016', 'es2017',
                    ]
                }
            })
        ] : [],
        require('rollup-plugin-typescript')({
            lib: ["es5", "es6", "es7", "dom"],
            target: "es5",
            module: 'CommonJS',
            typescript: require('typescript'),
            tslib: require('tslib')
        }),
        ...useBuble ? [require('rollup-plugin-buble')()] : [],
        require('rollup-plugin-commonjs')({
            extensions: ['.js', '.ts']
        })
    ]

    if (isProduction()) {
        defaultPlugins.push(
            fibRollup.plugins['rollup-plugin-uglify-js']()
        )
    }

    return defaultPlugins
}

export const utils = {
    getRequireVBox
}