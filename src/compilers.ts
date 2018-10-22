import { wrapAsString } from './vbox'

export function requireAsPath (buf: Class_Buffer, info) {
    return info.filename
}

export function requireAsPlain (buf: Class_Buffer, info) {
    return JSON.stringify(buf + '')
}