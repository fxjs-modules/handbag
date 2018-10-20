import util = require('util')

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

export function registerPugAsRenderer (vbox, options) {
    const { compilerOptions = {}, burnout_timeout = 0 } = options || {}
            
    setCompilerForVbox(vbox, {
        suffix: SUFFIX,
        compiler: (buf, info) => fpug.compile(buf + '', compilerOptions),
        burnout_timeout
    })
}