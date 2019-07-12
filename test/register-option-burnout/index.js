const test = require('test')
test.setup()

const fxHandbag = require('../../lib')

const vm = require('vm')
const coroutine = require('coroutine')
const path = require('path')
const os = require('os')

const readr = require('@fibjs/fs-readdir-recursive')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register feature: burnout about options', () => {
	const exclude_exts = ['.js', '.json', '.jsc']
	const test_files = readr(path.resolve(__dirname, '../'))
		.filter(fpath => !exclude_exts.some(ext => fpath.endsWith(ext)))

	const suffixes = Array.from(
		new Set(
			test_files
			// instrict ext fetch, but valid
			.map(filepath => '.' + path.basename(filepath).split('.')[1])
		)
	)

	;[
		[0, 30, true],
		[0, 20, true],
		[0, 50, true],
		[20, 30, false],
		[20, 35, false],
		[200, 191, true],
		[310, 301, true],
		[310, 290, true],
		[321, 301, true],
		[-50, 51, true],
		[-20, 30, true],
		[-20, 60, true]
	].forEach(([burnout_timeout, test_timeout, result]) => {
		describe(`burnout_timeout: ${burnout_timeout}, test_timeout: ${test_timeout}, result: ${result}`, () => {
			const vbox = new vm.SandBox(moduleHash)

			fxHandbag.registers.plain.registerAsPlain(vbox, {
				burnout_timeout,
				suffix: suffixes
			})

			test_files.forEach(basepath => {
				if (exclude_exts.some(ext => basepath.endsWith(ext)))
					return

				const relpath = path.join('..', basepath)
				const abspath = vbox.resolve(relpath, __dirname)

				it(`test file ${relpath}`, () => {
					// force remove abspath

					let range = Date.now()
					vbox.require(relpath, __dirname)
					range = Date.now() - range

					if (burnout_timeout > 0 && test_timeout - range <= 0)
						result = true
					else
						coroutine.sleep(test_timeout - range)

					assert.equal(vbox.has(vbox.resolve(relpath, __dirname)), result)

					vbox.remove(abspath)
				})
			})
		})
	})
})

if (require.main === module) {
	test.run(console.DEBUG)
	process.exit()
}
