import { registerAsPlain } from './plain'

export const SUFFIX = ['.md', '.markdown']
export function registerMarkdownAsPlain (vbox, options) {
    const { suffix = SUFFIX } = options || {}
    
    return registerAsPlain(vbox, {suffix, ...options})
}