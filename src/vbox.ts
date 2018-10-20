function setBurnAfterTimeoutVbox (vbox: Class_SandBox, options: {suffix: string|string[], compiler: Function, timeout?: number}) {
    const timeouts = {}

    const { suffix, compiler, timeout: _timeout = 1000 } = options;
    let { __burnout_timeout = 0 } = vbox as any || {}
    __burnout_timeout = __burnout_timeout && Number.isInteger(__burnout_timeout) ? __burnout_timeout : _timeout

    function compilerFn (buf: Class_Buffer, info: any) {
        let compiledContent = compiler(buf, info)

        const {filename: mid = ''} = info || {}

        if (timeouts[mid])
            clearTimeout(timeouts[mid])

        if (__burnout_timeout) {
            timeouts[mid] = setTimeout(() => {
                vbox.remove(mid)
            }, __burnout_timeout)
        }

        return `module.exports = ${compiledContent}`
    }

    let suffixArr = suffix

    if (!Array.isArray(suffixArr))
        suffixArr = [suffixArr]

    suffixArr.forEach(suffix => vbox.setModuleCompiler(suffix, compilerFn))
}

export function setCompilerForVbox (vbox: Class_SandBox, options: {suffix: string|string[], compiler: Function, burnout_timeout?: number}) {
    return setBurnAfterTimeoutVbox(vbox, {...options, timeout: options.burnout_timeout || 0})
}

export function wrapAsString (content: any) {
    return `\`${content}\``
}