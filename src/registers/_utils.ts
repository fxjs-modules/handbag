import util = require('util')

const fibRollup = require('fib-rollup')

export function parseCommonOptions (registerOptions: any = {}) {
    const { compilerOptions = {}, burnout_time = 0 } = registerOptions || {}

    return {
        compilerOptions, burnout_time
    }
}

export function getRollupOptions (registerOptions: any = {}) {
    const { rollup = {} } = registerOptions || {}
    rollup.bundleConfig = rollup.bundleConfig || {}
    
    rollup.writeConfig = rollup.writeConfig || {}
    rollup.writeConfig.output = util.extend({
        format: 'umd'
    }, rollup.writeConfig.output)

    rollup.onGenerateUmdName = typeof rollup.onGenerateUmdName === 'function' ? rollup.onGenerateUmdName : () => 'UmdName'

    return rollup
}

export function createVirtualZipFS (zipName: string = '/unzip.zip', filepath: string = 'file.txt', content: any) {
    const io = require('io')
    const fs = require('fs')
    const zip = require('zip')

    var stream = new io.MemoryStream();
    var zipfile = zip.open(stream, "w");
    zipfile.write(new Buffer(content), filepath);
    zipfile.close();

    stream.rewind();
    fs.setZipFS(zipName, stream.readAll());

    return () => fs.clearZipFS(zipName)
}

// function getOneSuffixPlainVBox (suffix) {
//     const vm = require('vm')

//     const vbox = new vm.SandBox(moduleHash)
//     registerAsPlain(vbox, suffix)

//     return vbox
// }