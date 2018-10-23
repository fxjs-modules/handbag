const { createFeServer } = require('./fe-server')

const srvInfo = createFeServer()

srvInfo.server.run(() => void 0)
console.log(`server started on listening ${srvInfo.port}`)
