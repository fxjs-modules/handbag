const test = require('test')
test.setup()

const fxHandbag = require('../../')

const stylus = require('stylus')

const vm = require('vm')
const util = require('util')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register: stylus', () => {
    let vbox = null
    let renderedCssList = []

    after(
        () => renderedCssList.forEach(
            (v, i) => i < renderedCssList.length - 1 && assert.equal(v, renderedCssList[i + 1])
        )
    )

    it('registerStylusAsPlain', () => {
        vbox = new vm.SandBox(moduleHash)

        function registerStylusAsPlain (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: ['.styl', '.stylus'],
                compiler: (buf, info) => {
                    return fxHandbag.vboxUtils.wrapAsString(buf + '')
                }
            })
        }

        registerStylusAsPlain(vbox)

        const plainText = vbox.require('./test.styl', __dirname)

        stylus.render(plainText, {}, (err, result) => {
            assert.isNull(err)
            renderedCssList.push(result)
        })

        const vbox2 = new vm.SandBox(moduleHash)

        fxHandbag.registers.stylus.registerStylusAsPlain(vbox2)

        assert.equal(
            vbox.require('./test.styl', __dirname),
            vbox2.require('./test.styl', __dirname)
        )
    })

    it('registerStylusAsCss', () => {
        vbox = new vm.SandBox(moduleHash)
        function registerStylusAsCss (vbox) {
            const compilerOptions = {}

            const renderSync = util.sync(stylus.render)
            
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: ['.styl', '.stylus'],
                compiler: (buf, info) => fxHandbag.vboxUtils.wrapAsString(
                    renderSync(buf + '', compilerOptions)
                )
            })
        }

        registerStylusAsCss(vbox)

        const result = vbox.require('./test.styl', __dirname)

        renderedCssList.push(result)

        const vbox2 = new vm.SandBox(moduleHash)

        fxHandbag.registers.stylus.registerStylusAsCss(vbox2)

        assert.equal(
            vbox.require('./test.styl', __dirname),
            vbox2.require('./test.styl', __dirname)
        )
    })

    it('invalid registerStylusAsRenderer', () => {
        vbox = new vm.SandBox(moduleHash)

        function registerStylusAsRenderer (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: ['.styl', '.stylus'],
                compiler: (buf, info) => {
                    return stylus(buf + '').render // 85408a1e-257e-48e4-9115-30786f670ee2
                }
            })
        }

        registerStylusAsRenderer(vbox)

        const renderer = vbox.require('./test.styl', __dirname)

        // it would throw exception because in 85408a1e-257e-48e4-9115-30786f670ee2, the context it not pure context of stylus module.
        assert.throws(() => {
            renderedCss = renderer()
        })
    })
})

require.main === module && test.run(console.DEBUG)
