import coroutine = require('coroutine')

interface SetVboxOptions {
    suffix: string|string[],
    compiler: Function,
    compile_to_iife_script?: boolean
}

interface SetBurnAfterTimeoutVboxOptions extends SetVboxOptions {
    timeout?: number
}
function setBurnAfterTimeoutVbox (vbox: Class_SandBox, options: SetBurnAfterTimeoutVboxOptions) {
    const timeouts = {}

    const { suffix, compiler, timeout: _timeout = 1000, compile_to_iife_script = false } = options;
    let { __burnout_timeout = 0 } = vbox as any || {}
    if (!Number.isInteger(__burnout_timeout))
        __burnout_timeout = 0
    __burnout_timeout = _timeout && Number.isInteger(_timeout) ? _timeout : __burnout_timeout;

    const sync_lock = new coroutine.Lock();

    function compilerFn (buf: Class_Buffer, info: any) {
        let compiledContent = compiler(buf, info)

        const {filename: mid = ''} = info || {}

        if (timeouts[mid]) {
            clearTimeout(timeouts[mid])
            timeouts[mid] = null
        }

        if (__burnout_timeout) {
            timeouts[mid] = setTimeout(() => {
                if (vbox.has(mid)) {
                    sync_lock.acquire()
                    vbox.remove(mid)
                    sync_lock.release()
                }
            }, __burnout_timeout)
        }

        if (compile_to_iife_script) {
            return compiledContent
        }
        return `module.exports = ${compiledContent}`
    }

    let suffixArr = suffix

    if (!Array.isArray(suffixArr))
        suffixArr = [suffixArr]

    suffixArr.forEach(suffix => vbox.setModuleCompiler(suffix, compilerFn))
}

interface SetCompilerForVboxOptions extends SetVboxOptions {
    burnout_timeout?: number,
}
export function setCompilerForVbox (vbox: Class_SandBox, options: SetCompilerForVboxOptions) {
    return setBurnAfterTimeoutVbox(vbox, {...options, timeout: options.burnout_timeout || 0})
}

export function wrapAsString (content: any) {
    return JSON.stringify(content)
}