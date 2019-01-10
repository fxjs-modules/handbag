const test = require('test')
test.setup()

const fxHandbag = require('../../')

const vm = require('vm')
const fs = require('fs')
const path = require('path')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register: gql', () => {
    let vbox = null

    it('registerGraphQLParser', () => {
        vbox = new vm.SandBox(moduleHash)

        fxHandbag.registers.graphql.registerGraphQLParser(vbox)
        const result = vbox.require('./query/query.gql', __dirname)
        assert.isObject(result)
        assert.equal(result.kind, 'Document')
        
        const def = result.definitions[0]
        assert.equal(def.kind, 'OperationDefinition')
    })

    it('registerGraphQLAsQueryBuilder', () => {
        vbox = new vm.SandBox(moduleHash)

        fxHandbag.registers.graphql.registerGraphQLAsQueryBuilder(vbox)
        const builder = vbox.require('./query/query.gql', __dirname)
        assert.isFunction(builder)

        assert.equal(
            builder(require('./query/query.ggl.input')),
            fs.readTextFile(path.resolve(__dirname, './query/query.gql.txt'))
        )
    })
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
