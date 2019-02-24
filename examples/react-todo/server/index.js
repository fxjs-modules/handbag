const path = require('path');
const http = require('http');
const mq = require('mq');
const vm = require('vm');
const fxHb = require('@fxjs/handbag');

const detectPort = require('@fibjs/detect-port');
const moduleList = require('@fibjs/builtin-modules')

const port = detectPort(process.env.PORT);

const vbox = new vm.SandBox({});
const commonOptions = { burnout_timeout: -2000 };

;[
	['iife', ['.jsx', '.tsx']],
].forEach(([format, suffix]) => {
	fxHb.registers.react.registerReactAsRollupedJavascript(vbox, {
		...commonOptions,
		suffix: suffix,
		transpileLib: 'babel',
		rollup: {
			onGenerateUmdName: () => undefined,
			bundleConfig: {
				external: moduleList.concat(
					['react', 'react-dom']
				)
			},
			writeConfig: {
				output: {
					globals: {
						'react': 'React',
						'react-dom': 'ReactDOM',
					},
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
	'(.*).jsx$': jsHandler,
	'*': http.fileHandler(path.resolve(__dirname, '../static'))
})

const server = new http.Server(port, routing)

server.run(() => void 0);
console.log(`server started on listening ${port}`)

process.on('SIGINT', () => {
	server.stop()
	process.exit()
})
