import fTypify = require('fib-typify')

import { setCompilerForVbox, wrapAsString } from '../vbox'

export const SUFFIX = ['.ts', '.tsx']

function _register (asPlainJavascript) {
    return function (vbox, options) {
        const { compilerOptions = fTypify.defaultCompilerOptions, burnout_timeout = 0 } = options || {}
        let compiler = null

        switch (asPlainJavascript) {
            case true:
                compiler = (buf, info) => wrapAsString(fTypify.compileRaw(buf + '', compilerOptions))
                break
            case false:
                compiler = (buf, info) => fTypify.compileRaw(buf + '', compilerOptions)
                break
            case undefined:
            default:
                break
        }
        setCompilerForVbox(vbox, {
            suffix: SUFFIX,
            compiler,
            burnout_timeout,
            compile_to_iife_script: !asPlainJavascript
        })
    }
    
}

export const registerTypescriptAsPlainJavascript = _register(true)
export const registerTypescriptAsModule = _register(false)
