const path = require('path');
const http = require('http');
const mq = require('mq');
const vm = require('vm');
const fxHb = require('@fxjs/handbag');

const detectPort = require('@fibjs/detect-port');

const port = detectPort(process.env.PORT);

const vbox = new vm.SandBox({});
fxHb.registers.riot.registerRiotAsJs(vbox)
fxHb.registers.plain.registerAsPlain(vbox, {suffix: ['.html']})

const routing = new mq.Routing({
	'(.*).html$': (req, _path) => req.response.write(vbox.require(`../views/${_path}`, __dirname)),
	'(.*).tag$': (req, _path) => req.response.write(vbox.require(`../views/${_path}`, __dirname)),
	'*': http.fileHandler(path.resolve(__dirname, '../static'))
})

const server = new http.Server(port, routing)

server.run(() => void 0);
console.log(`server started on listening ${port}`)

process.on('SIGINT', () => {
	server.stop()
	process.exit()
})
