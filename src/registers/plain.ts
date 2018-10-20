import { setCompilerForVbox } from '../vbox'
import { requireAsPlain } from '../compilers'

export const SUFFIX = ['.txt']
export function registerAsPlain (vbox, options) {
    const {
        suffix = SUFFIX,
        burnout_timeout = 0
    } = options || {}

    setCompilerForVbox(vbox, {
        suffix,
        compiler: requireAsPlain,
        burnout_timeout
    })
}