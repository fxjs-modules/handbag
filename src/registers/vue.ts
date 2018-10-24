import fibRollup = require('fib-rollup')

import { isProduction } from '../utils';
import { setCompilerForVbox, wrapAsString } from '../../lib/vbox';
import { getRollupOptions, createVirtualZipFS } from './_utils';

import moduleList = require('@fibjs/builtin-modules')

export const SUFFIX = ['.vue']

const DEFAULT_ROLLUP_PLUGIN_VUE_OPTS = {
    template: {
        isProduction: true
    }
}
export function registerVueAsRollupedJavascript (vbox, options) {
    const util = require('util')
    const { default: rollup } = require('fib-rollup');

    const { rollupPluginVueOptions = DEFAULT_ROLLUP_PLUGIN_VUE_OPTS, bundleClient = true, ...restOpts } = options || {}

    restOpts.suffix = restOpts.suffix || SUFFIX

    const {
        compilerOptions = null, burnout_timeout = 0
    } = options || {}

    const rollupConfig = getRollupOptions(options)
    rollupConfig.bundleConfig = rollupConfig.bundleConfig || {}
    rollupConfig.bundleConfig.plugins = rollupConfig.bundleConfig.plugins || getDefaultPlugins(rollupPluginVueOptions)

    if (isProduction())
        rollupConfig.bundleConfig.plugins.push(
            fibRollup.plugins['rollup-plugin-uglify-js']()
        )

    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => {
            // to hide real fs
            // const zipName = `./${Date.now()}.zip`
            // const vFSPath = require('path').basename(info.filename)
            // const zipNameToRequire = require('path').join(`${zipName}$`, vFSPath)
            // const clearTempZipFS = createVirtualZipFS(zipName, vFSPath, buf + '')
            // clearTempZipFS()

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

            return wrapAsString(rollupedJs)
        },
        burnout_timeout,
        compile_to_iife_script: false
    })
}

function getRequireVBox () {
    return fibRollup.getCustomizedVBox({
        prettier: {
            format: c => c
        }
    })
}

export function getDefaultPlugins (rollupPluginVueOptions = {}) {
    const rollupPluginRequireVbox = getRequireVBox()

    const rollupPluginVue = rollupPluginRequireVbox.require('rollup-plugin-vue', __dirname).default

    const defaultPlugins = [
        rollupPluginVue(rollupPluginVueOptions),
        fibRollup.plugins['rollup-plugin-fibjs-resolve'](),
        fibRollup.plugins['rollup-plugin-babel-standalone'](),
        require('rollup-plugin-commonjs')()
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