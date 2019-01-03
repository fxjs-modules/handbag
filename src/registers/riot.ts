/// <reference path="../../@types/index.d.ts" />

import riot = require('riot-compiler')

import { setCompilerForVbox, wrapAsString } from '../vbox'
import { parseCommonOptions, uglifyJs } from './_utils';

export const SUFFIX = ['.tag'];

export function registerRiotAsJs (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
        compilerOptions = <FxHandbag.CompilerOptionsTypeCommon>{},
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

	const {
		compress_js = true
	} = options || {}

	const with_source_map = compilerOptions.sourcemap

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf: string, info: any) => {
			let code = riot.compile(buf + '', compilerOptions, info.filename)
			if (with_source_map)
				code = code.code

			if (compress_js)
				code = uglifyJs(code, { fromString: true })
			// fetch result from uglifyJs's result
			code = code.code

			return wrapAsString(code)
		},
        burnout_timeout,
        emitter
    })
}
