const test = require('test')
test.setup()

run('./fs-plain')
run('./fs-image')

run('./frontend-template-engine')
run('./frontend-css-preprocessor')
run('./frontend-js-preprocessor')

run('./frontend-mvvm-framework')

run('./register-option-hooks')
run('./register-option-burnout')

run('./schema-graphql')

run('./server-proccessor')

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
