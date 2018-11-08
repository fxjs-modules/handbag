/// <reference types="fibjs" />

import util = require('util')
import events = require('events')

export function parseCommonOptions (registerOptions: any = {}): any {
    // registerOptions.suffix = registerOptions.suffix
    // registerOptions.compilerOptions = registerOptions.compilerOptions || {}
    
    registerOptions.burnout_time = registerOptions.burnout_time || 0
    registerOptions.hooks = registerOptions.hooks || []
    registerOptions.emitter = registerOptions.emitter || getCommonEmitter(registerOptions.hooks)
    
    return registerOptions    
}

export function getRollupOptionsFromRegisterOptions (registerOptions: any = {}) {
    const { rollup = {} } = registerOptions || {}
    rollup.bundleConfig = rollup.bundleConfig || {}
    
    rollup.writeConfig = rollup.writeConfig || {}
    rollup.writeConfig.output = util.extend({
        format: 'umd'
    }, rollup.writeConfig.output)

    rollup.onGenerateUmdName = typeof rollup.onGenerateUmdName === 'function' ? rollup.onGenerateUmdName : () => 'UmdName'

    return rollup
}

export function getCommonEmitter (onHooks): Class_EventEmitter {
    const emitter: any = new events.EventEmitter()

    if (!util.isObject(onHooks))
        return emitter

    Object.keys(onHooks).forEach(hook_key => {
        let handler = onHooks[hook_key], is_once = false
        if (util.isFunction(handler)) {
        } else if (util.isObject(handler)) {
            handler = handler.handler
            is_once = handler.is_once
        } else {
            console.error('invalid hook type, it must be object or function.')
        }

        if (!is_once)
            emitter.on(hook_key, handler)
        else
            emitter.off(hook_key, handler)
    })

    return emitter
}

/**
 * common event, ...args
 * - 'before_transpile', [{raw: buf, info}]
 * - 'generated', [{result: generatedConent}]
 */
// internal method
export function makeHookPayload (type: string, ...args): {[key: string]: any} {
    let payload = {}
    switch (type) {
        case 'before_transpile':
            payload = {raw: args[0], info: args[1]}
            break
        case 'generated':
            payload = {result: args[0]}
            break
    }

    return payload
}

export function createVirtualZipFS (zipName: string = '/unzip.zip', filepath: string = 'file.txt', content: any) {
    const io = require('io')
    const fs = require('fs')
    const zip = require('zip')

    var stream = new io.MemoryStream();
    var zipfile = zip.open(stream, "w");
    zipfile.write(new Buffer(content), filepath);
    zipfile.close();

    stream.rewind();
    fs.setZipFS(zipName, stream.readAll());

    return () => fs.clearZipFS(zipName)
}

// function getOneSuffixPlainVBox (suffix) {
//     const vm = require('vm')

//     const vbox = new vm.SandBox(moduleHash)
//     registerAsPlain(vbox, suffix)

//     return vbox
// }