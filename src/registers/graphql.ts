import { setCompilerForVbox } from '../vbox'
import { parseCommonOptions } from './_utils';

export const SUFFIX = ['.gql', '.graphql']
/**
 * @requries 'graphql-tag', 'graphql'
 * 
 * @param vbox 
 * @param options 
 */
export function registerGraphQLParser (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf: string, info) => {
            return `
            const gqltag = require('graphql-tag')
            module.exports = gqltag\`${buf + ''}\`
            `
        },
        compile_to_iife_script: true,
        burnout_timeout,
        emitter
    })
}

var REG_REPLACOR = /\$([A-Za-z_])([A-Za-z_0-9]*)/ig;
function replacor (str = '') {
    return str.replace(REG_REPLACOR, function (match, p1, p2, offset, string) {
        return '${input.' + p1 + p2 + '}'
    })
}
/**
 * replacor test case
 */
// ;[
//     '$var',
//     '$__var',
//     '$var123',
//     '$_1var123',
//     '$_1var123?',
//     '$_1var123:',
//     '$_1var123(',
//     '$_1var123{',
// ].forEach(input => {
//     const result = replacor(input)
//     console.log('test', REG_REPLACOR.test(input))
//     console.log('result', result)
// })

/**
 * @description use `input` as object for assigning
 * 
 * @param vbox 
 * @param options 
 */
export function registerGraphQLAsQueryBuilder (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const {
        burnout_timeout = 0,
        suffix = SUFFIX,
        emitter = null
    } = parseCommonOptions(options) || {}

    setCompilerForVbox(vbox, {
        suffix,
        compiler: (buf: string, info) => {
            const parsed = replacor(buf + '')
            return `
            module.exports = (input) => \`${parsed}\`
            `
        },
        compile_to_iife_script: true,
        burnout_timeout,
        emitter
    })
}
