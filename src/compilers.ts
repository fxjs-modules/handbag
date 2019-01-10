export function requireAsPath (buf: Class_Buffer, info): string {
    return info.filename
}

export function requireAsPlain (buf: Class_Buffer, info): string {
    return JSON.stringify(buf + '')
}
