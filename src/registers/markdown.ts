/// <reference path="../../@types/index.d.ts" />

import { registerAsPlain } from './plain'

export const SUFFIX = ['.md', '.markdown']
export function registerMarkdownAsPlain (vbox: Class_SandBox, options: FxHandbag.RegisterOptions): void {
    const { suffix = SUFFIX } = options || {}

    return registerAsPlain(vbox, {suffix, ...options})
}
