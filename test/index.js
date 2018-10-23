const test = require('test')
test.setup()

run('./fs-plain')
run('./fs-image')

run('./frontend-template-engine')
run('./frontend-css-preprocessor')
run('./frontend-js-preprocessor')

run('./server-proccessor')

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
