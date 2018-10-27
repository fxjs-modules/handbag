const test = require('test')
test.setup()

const fxHandbag = require('../../')

const cheerio = require('cheerio')

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
            tranpileLib: 'buble'
        })

        let rolledJs = null
        rolledJs = vbox.require('./vue/test.buble.vue', __dirname)

        assert.isTrue(!rolledJs.includes('const '))
    })

    it('registerVueAsRollupedJavascript: no-transpile mode', () => {
        vbox = new vm.SandBox(moduleHash)
        fxHandbag.registers.vue.registerVueAsRollupedJavascript(vbox, {
            tranpileLib: false
        })

        let rolledJs = null
        rolledJs = vbox.require('./vue/test.vue', __dirname)

        assert.isTrue(rolledJs.includes('const '))
        assert.isTrue(rolledJs.includes('async '))
    })
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
