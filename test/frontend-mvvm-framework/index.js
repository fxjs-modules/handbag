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

    it('require vue as componentOptions', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.vue.registerVueAsComponentOptions(vbox, {
        })

        coptions1 = vbox.require('./vue/test.vue', __dirname)

        coptions2 = vbox.require('./vue/index.js', __dirname)

        // equivalent in memory
        assert.equal(coptions1, coptions2)
    })
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
