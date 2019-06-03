#!/usr/bin/env fibjs

const cli = require('@fxjs/cli')('fpack')
const pkg = require('../package.json')

cli.version(pkg.version)

cli.help()
cli.parse()
