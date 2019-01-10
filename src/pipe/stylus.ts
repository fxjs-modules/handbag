/// <reference path="../../@types/index.d.ts" />

import fs = require('fs')
import path = require('path')
import util = require('util')

import stylus = require('stylus')

import { setCompilerForVbox, wrapAsString } from '../vbox'
import { registerAsPlain } from './plain'
import { parseCommonOptions } from './_utils';

export const SUFFIX = ['.styl', '.stylus']

export function registerStylusAsRenderer (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
		compilerOptions = <FxHandbag.CompilerOptionsTypeCommon>{},
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

	setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf: Class_Buffer, info: any) => {
			const params = collectRenderParams(compilerOptions, info.filename, buf + '')

			return `
			const stylus = require('stylus')
			const renderer = stylus(${JSON.stringify(params.input)})
				.set('filename', ${JSON.stringify(info.filename)})
				.set('paths', ${JSON.stringify(params.options.paths)})

			module.exports = renderer
			`
		},
		compile_to_iife_script: true,
        burnout_timeout,
        emitter
    })
}
