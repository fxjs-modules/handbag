const test = require('test')
test.setup()

const fxHandbag = require('../../')

const fpug = require('fib-pug')
const cheerio = require('cheerio')

const vm = require('vm')
const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

describe('register: pug', () => {
    let vbox = null

    const pugLocals = {
        testVar: Date.now()
    }

    function testRenderResult (renderedHtml, locals = {
        testVar: ''
    }) {
        assert.equal(cheerio(renderedHtml).find('#test').length, 0)
        assert.equal(cheerio(`<div>${renderedHtml}</div>`).find('#test').length, 1)

        assert.equal(cheerio(`<div>${renderedHtml}</div>`).find('style').length, 1)
        assert.equal(cheerio(`<div>${renderedHtml}</div>`).find('script').length, 1)

        assert.equal(cheerio(`<div>${renderedHtml}</div>`).find('#test > p').length, 1)
        assert.equal(cheerio(`<div>${renderedHtml}</div>`).find('#test > p').text(), locals.testVar)
    }

    const compilerOptions = {
        filters: {
            typescript: require('jstransformer-typescript').render,
            stylus: require('jstransformer-stylus').render,
        }
    }

    it('registerPugAsHtml', () => {
        vbox = new vm.SandBox(moduleHash)
        function registerPugAsHtml (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: '.pug',
                compiler: (buf, info) => JSON.stringify(
                    fpug.renderFile(info.filename, compilerOptions)
                )
            })
        }
        registerPugAsHtml(vbox)
        fxHandbag.registers.pug.hackGlobalForPugRuntime(vbox)

        const renderedHtml = vbox.require('./test.pug', __dirname)
        testRenderResult(renderedHtml)
        
        const vbox2 = new vm.SandBox(moduleHash)
        fxHandbag.registers.pug.registerPugAsHtml(vbox2, { compilerOptions })
        assert.equal(
            vbox.require('./test.pug', __dirname),
            vbox2.require('./test.pug', __dirname)
        )
    })

    it('registerPugAsRenderer', () => {
        vbox = new vm.SandBox(moduleHash)

        function registerPugAsRenderer (vbox) {
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: '.pug',
                compiler: (buf, info) => fpug.compile(buf + '', {...compilerOptions, inlineRuntimeFunctions: Math.random(0, 1) > 0.5}),
                timeout: 0
            })
        }

        registerPugAsRenderer(vbox)

        const renderer = vbox.require('./test.pug', __dirname)
        testRenderResult(renderer(pugLocals), pugLocals)

        const vbox2 = new vm.SandBox(moduleHash)
        fxHandbag.registers.pug.registerPugAsRenderer(vbox2, { compilerOptions })
        assert.equal(
            vbox.require('./test.pug', __dirname)(pugLocals),
            vbox2.require('./test.pug', __dirname)(pugLocals)
        )
    })
})

describe('register: riot', () => {
    let vbox = null

    it('registerRiotAsJs', () => {
        vbox = new vm.SandBox(moduleHash)
        vbox.add('module', class Module {})
        const riot = vbox.require('riot', __dirname)

        function registerRiotAsJs (vbox) {
            const compilerOptions = {
            }
            
            fxHandbag.vboxUtils.setCompilerForVbox(vbox, {
                suffix: '.tag',
                compiler: (buf, info) => fxHandbag.vboxUtils.wrapAsString(
                    riot.compile(buf + '', compilerOptions, info.filename)
                )
            })
        }
        registerRiotAsJs(vbox)

        const compiledJs = vbox.require('./test.tag', __dirname)
    })
})

require.main === module && test.run(console.DEBUG)
