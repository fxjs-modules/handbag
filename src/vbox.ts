/// <reference path="../@types/index.d.ts" />

import coroutine = require('coroutine')
import { makeHookPayload } from './registers/_utils';

function isValidSuffx (suffix: string) {
    return typeof suffix === 'string' && suffix && suffix[0] === '.'
}

interface SetBurnAfterTimeoutVboxOptions extends FxHandbag.SetVboxOptions {
    timeout?: number
}
function setBurnAfterTimeoutVbox (vbox: Class_SandBox, options: SetBurnAfterTimeoutVboxOptions) {
    const timeouts = {}

    const {
		compiler = null,
		emitter = null,
		suffix,
		timeout: _timeout = 1000,
		compile_to_iife_script = false
	} = options;

    let finalCompiler = compiler


	let nirvana = false
    let { __burnout_timeout = _timeout } = vbox as any || {}

    if (!Number.isInteger(__burnout_timeout))
        __burnout_timeout = 0
	else if(__burnout_timeout < 0) {
		nirvana = true
		__burnout_timeout = Math.abs(__burnout_timeout)
	}

    if (emitter) {
        finalCompiler = (buf: Class_Buffer, info: any) => {
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
					if (nirvana)
						vbox.require(mid, __dirname)
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

export function setCompilerForVbox (vbox: Class_SandBox, options: FxHandbag.SetCompilerForVboxOptions) {
    return setBurnAfterTimeoutVbox(vbox, {...options, timeout: options.burnout_timeout || 0})
}

export function wrapAsString (content: any) {
    return JSON.stringify(content)
}
