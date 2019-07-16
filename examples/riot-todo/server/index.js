const path = require('path');
const http = require('http');
const mq = require('mq');
const vm = require('vm');
const fxHb = require('@fxjs/handbag');

const detectPort = require('@fibjs/detect-port');

const port = detectPort(process.env.PORT);

const vbox = new vm.SandBox({});
const commonOptions = {
	burnout_timeout: -500,
	hooks: {
		'nirvana:mchanged' ({ info }) {
			console.log('[riot]mchanged', info)
		}
	}
};
fxHb.registers.riot.registerRiotAsJs(vbox, {...commonOptions})
fxHb.registers.plain.registerAsPlain(vbox, {...commonOptions, suffix: ['.html']})

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
