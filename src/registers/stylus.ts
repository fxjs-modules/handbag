import util = require('util')

import stylus = require('stylus')

import { setCompilerForVbox, wrapAsString } from '../vbox'
import { registerAsPlain } from './plain'

export const SUFFIX = ['.styl', '.stylus']
export function registerStylusAsPlain (vbox, options) {
    return registerAsPlain(vbox, {suffix: SUFFIX, ...options})
}

export function registerStylusAsCss (vbox, options) {
    const { compilerOptions = {}, burnout_timeout = 0 } = options || {}

    const renderSync = util.sync(stylus.render)
    
    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => wrapAsString(
            renderSync(buf + '', compilerOptions)
        ),
        burnout_timeout
    })
}