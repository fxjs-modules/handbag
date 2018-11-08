import { setCompilerForVbox, wrapAsString } from '../vbox'
import { parseCommonOptions } from './_utils';

export const SUFFIX = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']

export function registerImageAsBase64 (vbox, options) {
    const {
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf, info) => wrapAsString(buf.toString('base64')),
        burnout_timeout,
        emitter
    })
}