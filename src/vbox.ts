import coroutine = require('coroutine')
import { makeHookPayload } from './registers/_utils';

interface SetVboxOptions {
    suffix: string|string[],
    compiler: Function,
    compile_to_iife_script?: boolean

    emitter?: Class_EventEmitter
}

function isValidSuffx (suffix: string) {
    return typeof suffix === 'string' && suffix && suffix[0] === '.'
}   

interface SetBurnAfterTimeoutVboxOptions extends SetVboxOptions {
    timeout?: number
}
function setBurnAfterTimeoutVbox (vbox: Class_SandBox, options: SetBurnAfterTimeoutVboxOptions) {
    const timeouts = {}

    const { compiler = null, emitter = null, suffix, timeout: _timeout = 1000, compile_to_iife_script = false } = options;
    let finalCompiler = compiler

    let { __burnout_timeout = 0 } = vbox as any || {}
    if (!Number.isInteger(__burnout_timeout))
        __burnout_timeout = 0
    __burnout_timeout = _timeout && Number.isInteger(_timeout) ? _timeout : __burnout_timeout;

    if (emitter) {
        finalCompiler = (buf, info) => {
            emitter.emit('before_transpile', makeHookPayload('before_transpile', buf, info))

            const payload = makeHookPayload('generated', compiler(buf, info))
            emitter.emit('generated', payload)
            return payload.result
        }
    }

    const sync_lock = new coroutine.Lock();

    function compilerFn (buf: Class_Buffer, info: any) {
        let compiledContent = finalCompiler(buf, info)

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

    suffixArr.forEach(suffix => {
        if(!isValidSuffx(suffix))
            throw `isValidSuffx ${suffix}`
            
        vbox.setModuleCompiler(suffix, compilerFn)
    })
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