const path = require('path');
const http = require('http');
const mq = require('mq');
const vm = require('vm');
const fxHb = require('@fxjs/handbag');

const detectPort = require('@fibjs/detect-port');

const port = detectPort(process.env.PORT);

const vbox = new vm.SandBox({});
const commonOptions = { burnout_timeout: -2000 };

;[
	['system', ['.vue']],
	['iife', ['.vjs']]
].forEach(([format, suffix]) => {
	fxHb.registers.vue.registerVueAsRollupedJavascript(vbox, {
		...commonOptions,
		suffix: suffix,
		rollup: {
			onGenerateUmdName: () => undefined,
			writeConfig: {
				output: {
					format: format
				}
			}
		}
	})
});

fxHb.registers.plain.registerAsPlain(vbox, {...commonOptions, suffix: ['.html']})

const jsHandler = (req, _path) => {
	req.response.write(vbox.require(`../views/${_path}`, __dirname))
	req.response.setHeader({
		'Content-Type': 'application/javascript'
	})
}

const routing = new mq.Routing({
	'(.*).html$': (req, _path) => req.response.write(vbox.require(`../views/${_path}`, __dirname)),
	'(.*).vue$': jsHandler,
	'(.*).vjs$': jsHandler,
	'*': http.fileHandler(path.resolve(__dirname, '../static'))
})

const server = new http.Server(port, routing)

server.run(() => void 0);
console.log(`server started on listening ${port}`)

process.on('SIGINT', () => {
	server.stop()
	process.exit()
})
