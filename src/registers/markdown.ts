import { registerAsPlain } from './plain'

export const SUFFIX = ['.md', '.markdown']
export function registerMarkdownAsPlain (vbox, options) {
    return registerAsPlain(vbox, {suffix: SUFFIX, ...options})
}