const test = require('test')
test.setup()

const fxHandbag = require('../../')

const vm = require('vm')
const fs = require('fs')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register: image', () => {
    let vbox = null

    const testFiles = [
        './test.png',
    ]

    it('registerImageAsBase64', () => {
        vbox = new vm.SandBox(moduleHash)

        function registerImageAsBase64 (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: fxHandbag.registers.image.SUFFIX,
                compiler: buf => JSON.stringify(buf.toString('base64'))
            })
        }

        registerImageAsBase64(vbox)

        const vbox2 = new vm.SandBox(moduleHash)
        fxHandbag.registers.image.registerImageAsBase64(vbox2)

        testFiles.forEach(relpath => {
            const base64String = vbox.require(relpath, __dirname)

            assert.equal(
                base64String,
                fs.openFile(vbox.resolve(relpath, __dirname)).readAll().toString('base64')
            )

            assert.equal(
                vbox.require(relpath, __dirname),
                vbox2.require(relpath, __dirname)
            )
        })
    })
})

require.main === module && test.run(console.DEBUG)
