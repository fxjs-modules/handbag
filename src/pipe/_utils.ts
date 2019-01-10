
export function parseCommonOptions (registerOptions: FxHandbag.PipeOptions = {}): FxHandbag.PipeOptions {
    registerOptions.suffix = registerOptions.suffix
    registerOptions.compilerOptions = registerOptions.compilerOptions

    return registerOptions as FxHandbag.PipeOptions
}
