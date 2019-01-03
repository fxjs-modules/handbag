import { setCompilerForVbox } from '../vbox'
import { requireAsPlain } from '../compilers'
import { parseCommonOptions } from './_utils';

export const SUFFIX = ['.txt']
export function registerAsPlain (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

    setCompilerForVbox(vbox, {
        suffix,
        compiler: requireAsPlain,
        burnout_timeout,
        emitter
    })
}
