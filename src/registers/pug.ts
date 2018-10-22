import fs = require('fs')
import path = require('path')

import fpug = require('fib-pug')

import { setCompilerForVbox, wrapAsString } from '../vbox'

export const SUFFIX = ['.pug', '.jade']

export function registerPugAsHtml (vbox, options) {
    const { compilerOptions = {}, burnout_timeout = 0 } = options || {}
    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => wrapAsString(
            fpug.compile(buf + '', compilerOptions)()
        ),
        burnout_timeout
    })
}

export function hackGlobalForPugRuntime (vbox) {
    vbox.run(path.resolve(__dirname, './global_hack/pug.js'))
}

export function registerPugAsRenderer (vbox, options) {
    const { compilerOptions = {}, burnout_timeout = 0 } = options || {}
    
    if (compilerOptions.inlineRuntimeFunctions === undefined) {
        compilerOptions.inlineRuntimeFunctions = false
    }
    compilerOptions.inlineRuntimeFunctions = !!compilerOptions.inlineRuntimeFunctions

    hackGlobalForPugRuntime(vbox)
    vbox.run(path.resolve(__dirname, './global_hack/pug.js'))
    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => {
            compilerOptions.filename = info.filename
            return fpug.compile(buf + '', compilerOptions)
        },
        burnout_timeout
    })
}