const test = require('test')
test.setup()

const fxHandbag = require('../../')

const fTypify = require('fib-typify')

const vm = require('vm')
const util = require('util')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

function testCjsModule (mod) {
    assert.isFunction(mod.foo)
    assert.isFunction(mod.bar)
    assert.equal(mod.bar(), mod.foo)
}

describe('register: typescript', () => {
    let vbox = null

    it('registerTypescriptAsModule', () => {
        vbox = new vm.SandBox(moduleHash)
        function registerTypescriptAsModule (vbox) {
            const compilerOptions = {...fTypify.defaultCompilerOptions}
            
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: fxHandbag.registers.typescript.SUFFIX,
                compiler: (buf, info) => fTypify.compileRaw(buf + '', compilerOptions)
            })
        }

        registerTypescriptAsModule(vbox)

        const result = vbox.require('./test.ts', __dirname)
        testCjsModule(result)

        const vbox2 = new vm.SandBox(moduleHash)

        fxHandbag.registers.typescript.registerTypescriptAsModule(vbox2)

        assert.equal(
            vbox.require('./test.ts', __dirname).bar()(),
            vbox2.require('./test.ts', __dirname).bar()()
        )
    })

    it('registerTypescriptAsPlainJavascript', () => {
        vbox = new vm.SandBox(moduleHash)
        function registerTypescriptAsPlainJavascript (vbox) {
            const compilerOptions = {...fTypify.defaultCompilerOptions}
            
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: fxHandbag.registers.typescript.SUFFIX,
                compiler: (buf, info) => JSON.stringify(fTypify.compileRaw(buf + '', compilerOptions))
            })
        }

        registerTypescriptAsPlainJavascript(vbox)

        const result = vbox.require('./test.ts', __dirname)
        assert.isString(result)

        const vbox2 = new vm.SandBox(moduleHash)

        fxHandbag.registers.typescript.registerTypescriptAsPlainJavascript(vbox2)

        assert.equal(
            vbox.require('./test.ts', __dirname),
            vbox2.require('./test.ts', __dirname)
        )
    })    
})

if (process.env.FX_HANDBAG_FULLTEST) {
    describe('register: rollup', () => {
        it('registerAsRollupedJavascript', () => {
            vbox = new vm.SandBox(moduleHash)

            fxHandbag.registers.rollup.registerAsRollupedJavascript(vbox)

            const result = vbox.require('./test.ts', __dirname)

            const vbox2 = new vm.SandBox(moduleHash)
            const tpath = Date.now() + '.js'
            vbox2.addScript(tpath, result)

            // test its cjs only
            const module = vbox2.require(tpath, __dirname)
            testCjsModule(module)
        })
    })
}

require.main === module && test.run(console.DEBUG)
