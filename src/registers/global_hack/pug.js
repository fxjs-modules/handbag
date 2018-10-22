const runtime = require('pug-runtime')

// for server-render-compilation mode
global.pug = global.pug || runtime

// for client-render-compilation mode
global.pug_merge = runtime.merge
global.pug_classes_array = runtime.classes_array
global.pug_style = runtime.style
global.pug_attr = runtime.attr
global.pug_attrs = runtime.attrs
global.pug_escape = runtime.escape
global.pug_rethrow = runtime.rethrow