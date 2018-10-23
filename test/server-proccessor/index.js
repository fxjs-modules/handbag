const test = require('test')
test.setup()

const xml = require('xml')
const http = require('http')
const cheerio = require('cheerio')
const { createFeServer } = require('./fe-server')

const srvInfo = createFeServer()
srvInfo.server.run(() => void 0)

describe('frontend-server', () => {
    let rep = null
    it('application/javascript', () => {
        let jsString = null

        rep = http.get(`${srvInfo.serverBase}/lib/app.js`)
        jsString = rep.body.readAll().toString()

        assert.isTrue(!jsString.includes('const '))
        assert.isTrue(!jsString.includes('export '))

        rep = http.get(`${srvInfo.serverBase}/lib/widget.m.js`)
        jsString = rep.body.readAll().toString()
        assert.isTrue(jsString.includes(`console.log('I am in widget 1')`))
    })

    it('text/css', () => {
        rep = http.get(`${srvInfo.serverBase}/styles/app.css`)

        const cssString = rep.body.readAll().toString()

        assert.ok(cssString)
    })

    it('text/html', () => {
        rep = http.get(`${srvInfo.serverBase}/index.html`)

        const htmlString = rep.body.readAll().toString()

        assert.ok(htmlString)
        
        const bodyString = xml.parse(htmlString, 'text/html').body.toString()
        const $ = cheerio(`<div>${bodyString}</div>`)

        assert.equal($.find('#test-page').length, 1)
        assert.equal($.find('.test-block').length, 1)
    })
})

if (require.main === module) {
    test.run(console.DEBUG)
    process.exit()
}
