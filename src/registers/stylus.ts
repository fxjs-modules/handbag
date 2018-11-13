import fs = require('fs')
import path = require('path')
import util = require('util')

import stylus = require('stylus')

import { setCompilerForVbox, wrapAsString } from '../vbox'
import { registerAsPlain } from './plain'
import { parseCommonOptions } from './_utils';

export const SUFFIX = ['.styl', '.stylus']
export function registerStylusAsPlain (vbox, options) {
    const { suffix = SUFFIX } = options || {}
    return registerAsPlain(vbox, {suffix, ...options})
}

function findNodeModulesRecursively (startPoint = '') {
    if (startPoint === '/')
        return

    const absPath = path.resolve(startPoint)
    const testPath = path.join(absPath, 'node_modules')

    if (!fs.exists(testPath) || !fs.stat(testPath).isDirectory())
        return findNodeModulesRecursively(path.dirname(absPath))
    else
        return testPath
}

export function registerStylusAsCss (vbox, options) {
    const {
        compilerOptions = {},
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}
    compilerOptions.paths = util.isArray(compilerOptions.paths) ? compilerOptions.paths : []

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf, info) => {
			const params = collectRenderParams(compilerOptions, info.filename, buf + '')

			const renderCallback = (params, cb) => {
				setTimeout(() => {
					stylus(params.input)
						.set('filename', info.filename)
						.set('paths', params.options.paths)
						.render(function (err, css) {
							if (err)
								throw err

							cb(null, css)
						})
				}, 0);
			}

			const renderSync = util.sync(renderCallback, false)

            return wrapAsString(renderSync(params))
        },
        burnout_timeout,
		emitter
    })
}

export function registerStylusAsRenderer (vbox, options) {
    const {
		compilerOptions = {},
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

	setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf, info) => {
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

function collectRenderParams (compilerOptions, mid, stylusRaw = '') {
	let { paths = [] } = compilerOptions || {}

	paths = [
		...paths,
		path.dirname(mid),
	]

	paths = Array.from(new Set(paths))

	const nmPath = findNodeModulesRecursively(process.cwd())
	if (nmPath)
		paths.push(nmPath)

	return {
		input: stylusRaw,
		options: {
			filename: mid,
			paths
		}
	}
}
