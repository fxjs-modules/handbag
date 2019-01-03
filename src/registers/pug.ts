/// <reference path="../../@types/index.d.ts" />

import path = require('path')

import fpug = require('fib-pug')

import { setCompilerForVbox, wrapAsString } from '../vbox'
import { parseCommonOptions } from './_utils';

export const SUFFIX = ['.pug', '.jade']

function prettyCompilerOptions (compilerOptions) {
	compilerOptions.basedir = compilerOptions.basedir || process.cwd()

    compilerOptions.inlineRuntimeFunctions = !!compilerOptions.inlineRuntimeFunctions

    return compilerOptions
}

function assignFilenameOption (compilerOptions: FxHandbag.CompilerOptionsTypeCommon, filename: string) {
	compilerOptions.filename = compilerOptions.filename || filename
}

export function registerPugAsHtml (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
        compilerOptions = <FxHandbag.CompilerOptionsTypeCommon>{},
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

    prettyCompilerOptions(compilerOptions)

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf: string, info) => {
			assignFilenameOption(compilerOptions, info.filename)

			return wrapAsString(
				fpug.compile(buf + '', compilerOptions)()
			)
		},
        burnout_timeout,
        emitter
    })
}

export function hackGlobalForPugRuntime (vbox: Class_SandBox): void {
    vbox.run(path.resolve(__dirname, './global_hack/pug.js'))
}

export function registerPugAsRenderer (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
        compilerOptions = <FxHandbag.CompilerOptionsTypeCommon>{},
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

    prettyCompilerOptions(compilerOptions)

    hackGlobalForPugRuntime(vbox)
    vbox.run(path.resolve(__dirname, './global_hack/pug.js'))
    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf: Class_Buffer, info: any) => {
			assignFilenameOption(compilerOptions, info.filename)

            return fpug.compile(buf + '', compilerOptions)
        },
        burnout_timeout,
        emitter
    })
}
