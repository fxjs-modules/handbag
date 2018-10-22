import fTypify = require('fib-typify')

import { setCompilerForVbox, wrapAsString } from '../vbox'

export const SUFFIX = ['.ts', '.tsx']

function _register (asPlain = false) {
    asPlain = !!asPlain

    return function (vbox, options) {
        const { compilerOptions = fTypify.defaultCompilerOptions, burnout_timeout = 0 } = options || {}
        setCompilerForVbox(vbox, {
            suffix: SUFFIX,
            compiler: asPlain ?
                    (buf, info) => wrapAsString(fTypify.compileRaw(buf + '', compilerOptions))
                    : (buf, info) => fTypify.compileRaw(buf + '', compilerOptions)
                    ,
            burnout_timeout,
            compile_to_script: !asPlain
        })
    }
    
}

export const registerTypescriptAsModule = _register(false)
export const registerTypescriptAsPlainJavascript = _register(true)