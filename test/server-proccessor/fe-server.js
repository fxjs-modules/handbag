const vm = require('vm')
const path = require('path')
const http = require('http')
const mq = require('mq')

const moduleHash = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()
const detectPort = require('@fibjs/detect-port')
const fxHandbag = require('../../')

const fibRollup = require('fib-rollup')

const babelStandalone = require('@babel/standalone')
// const babelStandalone = require('@babel/standalone/babel.min.js')

exports.createFeServer = function () {
    const clientVBox = new vm.SandBox(moduleHash)

    const burnout_timeout = 400
    fxHandbag.registers.pug.registerPugAsRenderer(clientVBox, {burnout_timeout})
    fxHandbag.registers.stylus.registerStylusAsCss(clientVBox, {burnout_timeout})

    const rollupPlugins = [
        fibRollup.plugins['rollup-plugin-fibjs-resolve'](),
        (function () {
            return {
                name: 'rollup-plugin-babel-standalone',
                transform (code, id) {
                    const transformed = babelStandalone.transform(code, {
                        presets: [
                            ['es2015', { "modules": false }],
                            'es2016', 'es2017',
                            /* ['stage-0'] */
                        ],
                    })

                    // console.log('transformed', Object.keys(transformed))
                    
                    return {
                        code: transformed.code,
                        map: transformed.map
                    }
                }
            }
        })(),
        require('rollup-plugin-commonjs')(),
    ]

    if (process.env.NODE_ENV === 'production')
        rollupPlugins.push(fibRollup.plugins['rollup-plugin-uglify-js']())
        
    fxHandbag.registers.rollup.registerAsRollupedJavascript(clientVBox, {
        suffix: ['m.ts', '.mjs'],
        rollupConfig: { plugins: rollupPlugins },
        burnout_timeout,
        onGenerateUmdName: (buf, info) => {
            return path.basename(info.filename.replace('.m.ts', ''))
        }
    })
    fxHandbag.registers.rollup.registerAsRollupedJavascript(clientVBox, {
        rollupConfig: { plugins: rollupPlugins },
        burnout_timeout,
        onGenerateUmdName: (buf, info) => {
            return path.basename(info.filename).replace('.ts', '')
        }
    })

    const routes = {
        '(.*).html': (req, filepath) => {
            filepath = path.join(__dirname, './root', './', filepath).replace(__dirname, '.')

            const renderer = clientVBox.require(filepath, __dirname)

            req.response.setHeader({'Content-Type': 'text/html; charset=utf8'})
            req.response.write(renderer())
        },
        '(.*).css': (req, filepath) => {
            filepath = path.join(__dirname, './root', './', filepath).replace(__dirname, '.')

            const css = clientVBox.require(filepath, __dirname)

            req.response.setHeader({'Content-Type': 'text/css; charset=utf8'})
            req.response.write(css)
        },
        '(.*).js': (req, filepath) => {
            filepath = path.join(__dirname, './root', './', filepath).replace(__dirname, '.')

            const js = clientVBox.require(filepath, __dirname)

            req.response.setHeader({'Content-Type': 'application/javascript; charset=utf8'})
            req.response.write(js)
        },
        '*': (req) => {
            if (req.value === '/') {
                req.value = '/index.html'
                mq.invoke(routing, req)
            }
        }
    }
    const routing = new mq.Routing(routes)

    const port = detectPort(process.env.FX_HANDBAG_PORT)
    const server = new http.Server(port, routing)

    return {
        server,
        port,
        get serverBase () {
            return `http://127.0.0.1:${port}`
        }
    }
}