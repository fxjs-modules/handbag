const test = require('test')
test.setup()

const fxHandbag = require('../../')

const vm = require('vm')
const fs = require('fs')
const path = require('path')

const readr = require('@fibjs/fs-readdir-recursive')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register feature: hooks', () => {
    let vbox = null

    const test_files = readr(path.resolve(__dirname, '../'))
    const exclude_exts = [
        '.js'
    ]
    const suffixes = Array.from(
        new Set(
            test_files
                // instrict ext fetch, but valid
                .map(filepath => '.' + path.basename(filepath).split('.')[1])
                .filter(ext => !exclude_exts.includes(ext))
        )
    )

    it('hooks', () => {
        vbox = new vm.SandBox(moduleHash)

        fxHandbag.registers.plain.registerAsPlain(vbox, {
            suffix: suffixes,
            hooks: {
                before_transpile: (payload) => {
                    assert.property(payload, 'raw')
                    assert.property(payload, 'info')

                    assert.equal(
                        payload.raw.toString(),
                        fs.openFile(payload.info.filename).readAll().toString()
                    )
                },
                generated: (payload) => {
                    assert.property(payload, 'result')
                }
            }
        })

        test_files.forEach(basepath => {
            if (exclude_exts.some(ext => basepath.endsWith(ext)))
                return

            const relpath = path.join('../', basepath)
            vbox.require(relpath, __dirname)
        })
    })
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
