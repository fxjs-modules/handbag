import { setCompilerForVbox, wrapAsString } from '../vbox'

export const SUFFIX = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']

export function registerImageAsBase64 (vbox, options) {
    const {
        suffix = SUFFIX,
        burnout_timeout = 0
    } = options || {}

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf, info) => wrapAsString(buf.toString('base64')),
        burnout_timeout
    })
}