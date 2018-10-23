const test = require('test')
test.setup()

const fxHandbag = require('../../')

const vm = require('vm')
const fs = require('fs')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register: txt', () => {
    let vbox = null

    it('registerTxtAsPlain', () => {
        vbox = new vm.SandBox(moduleHash)

        function registerTxtAsPlain (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: ['.txt'],
                compiler: fxHandbag.compilers.requireAsPlain
            })
        }

        registerTxtAsPlain(vbox)

        const plainText = vbox.require('./test.txt', __dirname)

        assert.equal(
            plainText,
            fs.readTextFile(vbox.resolve('./test.txt', __dirname))
        )

        const vbox2 = new vm.SandBox(moduleHash)
        fxHandbag.registers.plain.registerAsPlain(vbox2)
        assert.equal(
            vbox.require('./test.txt', __dirname),
            vbox2.require('./test.txt', __dirname)
        )
    })
})

describe('register: markdown', () => {
    let vbox = null

    const testFiles = [
        './test.md',
        './test.markdown'
    ]

    it('registerMarkdownAsPlain', () => {
        vbox = new vm.SandBox(moduleHash)

        function registerMarkdownAsPlain (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: ['.md', '.markdown'],
                compiler: fxHandbag.compilers.requireAsPlain
            })
        }

        registerMarkdownAsPlain(vbox)

        const vbox2 = new vm.SandBox(moduleHash)
        fxHandbag.registers.markdown.registerMarkdownAsPlain(vbox2)

        testFiles.forEach(relpath => {
            const plainText = vbox.require(relpath, __dirname)

            assert.equal(
                plainText,
                fs.readTextFile(vbox.resolve(relpath, __dirname))
            )

            assert.equal(
                vbox.require(relpath, __dirname),
                vbox2.require(relpath, __dirname)
            )
        })
    })
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
