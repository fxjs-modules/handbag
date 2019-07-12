/// <reference path="../@types/index.d.ts" />

import coroutine = require('coroutine')
import fs = require('fs')
import hash = require('hash')
import { makeHookPayload } from './registers/_utils';

function isValidSuffx (suffix: string) {
    return typeof suffix === 'string' && suffix && suffix[0] === '.'
}

function md5 (buf: Class_Buffer) {
	return hash.md5(buf).digest('hex')
}

function computeLastModifiedMd5 (mid: string) {
	let info = <Class_Stat>{}
	try {
		info = fs.stat(mid)
	} catch (err) {}

	return md5( [
		mid,
		info.size,
		info.ctime.getTime(),
		info.mtime.getTime()
	].join('||') as any )
}

interface SetBurnAfterTimeoutVboxOptions extends FxHandbag.SetVboxOptions {
    timeout?: number
}
function setBurnAfterTimeoutVbox (vbox: Class_SandBox, options: SetBurnAfterTimeoutVboxOptions) {
    const m_caches = <{[mid: string]: {
		md5?: string
		timeout?: any
		compiledScript?: string
		w_fiber?: Class_Fiber
	}}>{}
	function clear_m_to (mid: string | number) {
		if (!m_caches[mid])
			return ;

		if (m_caches[mid].timeout) {
			clearTimeout(m_caches[mid].timeout)
			m_caches[mid].timeout = null
		}
	}

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
	const lock_cb = (cb) => {
		sync_lock.acquire()
		cb()
		sync_lock.release()
	}

    function compilerFn (buf: Class_Buffer, info: any) {
        const {filename: mid = ''} = info || {}
		let compiledContent = null as string

		m_caches[mid] = m_caches[mid] || {}

		/* do require, but if cache existed, use cached script string */
		;(() => {
			const m_md5 = computeLastModifiedMd5(mid)

			if (m_md5 === m_caches[mid].md5 && m_caches[mid].compiledScript) {
				compiledContent = m_caches[mid].compiledScript
			} else {
				m_caches[mid].compiledScript = compiledContent = finalCompiler(buf, info)
				m_caches[mid].md5 = m_md5;
			}
		})()

        if (__burnout_timeout) {
			clear_m_to(mid)

			if (!nirvana) {
				m_caches[mid].timeout = setTimeout(() => {
					if (vbox.has(mid)) {
						lock_cb(() => {
							vbox.remove(mid)
						})
					}
				}, __burnout_timeout)
			} else {
				m_caches[mid].w_fiber = m_caches[mid].w_fiber || coroutine.start(() => {
					while (true) {
						coroutine.sleep(__burnout_timeout)
						const new_md5 = computeLastModifiedMd5(mid)

						sync_lock.acquire();
						/**
						 * always delete module, the cache would useful in next-time require(mid)
						 */
						if (new_md5 !== m_caches[mid].md5) {
							if (emitter)
								emitter.emit(
									'nirvana:mchanged',
									makeHookPayload('nirvana:mchanged',
										info
									)
								)

							vbox.remove(mid)
							vbox.require(mid, __dirname)
						}

						sync_lock.release();
					}
				})
			}
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
