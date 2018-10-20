import { wrapAsString } from './vbox'

export function requireAsPlain (buf: Class_Buffer, info) {
    return wrapAsString(buf + '')
}