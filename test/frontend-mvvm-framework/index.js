const test = require('test')
test.setup()

const fxHandbag = require('../../')

const vm = require('vm')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register: vue', () => {
    let vbox = null

    it('registerVueAsRollupedJavascript: default/babel mode', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.vue.registerVueAsRollupedJavascript(vbox)

        let rolledJs = null
        rolledJs = vbox.require('./vue/test.vue', __dirname)

        assert.isTrue(!rolledJs.includes('const '))
        assert.isTrue(!rolledJs.includes('async '))
    })

    it('registerVueAsRollupedJavascript: buble mode', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.vue.registerVueAsRollupedJavascript(vbox, {
            transpileLib: 'buble'
        })

        let rolledJs = null
        rolledJs = vbox.require('./vue/test.buble.vue', __dirname)

        assert.isTrue(!rolledJs.includes('const '))
    })

    it('registerVueAsRollupedJavascript: no-transpile mode', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.vue.registerVueAsRollupedJavascript(vbox, {
            transpileLib: false
        })

        let rolledJs = null
        rolledJs = vbox.require('./vue/test.vue', __dirname)

        assert.isTrue(rolledJs.includes('const '))
        assert.isTrue(rolledJs.includes('async '))
    })

    ;[
        'buble',
        'babel'
    ].forEach((transpileLib) => {
        it(`require vue as componentOptions: ${transpileLib}`, () => {
            const vbox = new vm.SandBox(moduleHash)

            fxHandbag.registers.vue.registerVueAsComponentOptions(vbox, {
                transpileLib
            })
    
            coptions1 = vbox.require('./vue/test.vue', __dirname)
    
            coptions2 = vbox.require('./vue/index.js', __dirname)
    
            // equivalent in memory
            assert.deepEqual(coptions1, coptions2)
        });
    });
})

describe('register: react', () => {
    let vbox = null

    it('registerReactAsRollupedJavascript: default/babel mode', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.react.registerReactAsRollupedJavascript(vbox)

        let rolledJs = null
        rolledJs = vbox.require('./react/test.jsx', __dirname)

        assert.isTrue(!rolledJs.includes('const '))
        assert.isTrue(!rolledJs.includes('async '))
    })

    it('registerReactAsRollupedJavascript: buble mode', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.react.registerReactAsRollupedJavascript(vbox, {
            transpileLib: 'buble'
        })

        let rolledJs = null
        rolledJs = vbox.require('./react/test.buble.jsx', __dirname)

        assert.isTrue(!rolledJs.includes('const '))
    })

    it('registerReactAsRollupedJavascript: no-transpile mode for .tsx', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.react.registerReactAsRollupedJavascript(vbox, {
            transpileLib: false
        })

        let rolledJs = null
        rolledJs = vbox.require('./react/test.tsx', __dirname)

        assert.isFalse(rolledJs.includes('const '))
        assert.isTrue(rolledJs.includes('var '))
        assert.isFalse(rolledJs.includes('async '))
    })

    ;[
        'buble',
        'babel'
    ].forEach((transpileLib) => {
        it(`require react as module: ${transpileLib}`, () => {
            const vbox = new vm.SandBox(moduleHash)

            fxHandbag.registers.react.registerReactAsModule(vbox, {
                transpileLib
            })
    
            coptions1 = vbox.require('./react/test.jsx', __dirname)
    
            coptions2 = vbox.require('./react/index.js', __dirname)
    
            // equivalent in memory
            assert.deepEqual(coptions1, coptions2)
        });
    });
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
