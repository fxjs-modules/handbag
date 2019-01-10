/// <reference types="fibjs" />

declare namespace FxHandbag {

	interface SetVboxOptions {
		suffix: string | string[],
		compiler: Function,
		compile_to_iife_script?: boolean

		emitter?: Class_EventEmitter
	}

	interface SetCompilerForVboxOptions extends SetVboxOptions {
		burnout_timeout?: number,
	}

	interface Fn_setCompilerForVbox {
		(vbox: Class_SandBox, options: FxHandbag.SetCompilerForVboxOptions): void
	}

	interface Fn_wrapAsString {
		(content: any): string
	}

	interface CompilerOptionsTypeCommon {
		[key: string]: any
	}

	interface CommonRegisterOptions {
		burnout_timeout: number,
		hooks: Function[],
		emitter: Class_EventEmitter,
		suffix: string[],
		compilerOptions: CompilerOptionsTypeCommon
	}

	interface VBoxCompilerOptionsBase<CompilerOptionsType = CompilerOptionsTypeCommon> {
		burnout_timeout?: number,
		hooks?: Function[],
		emitter?: Class_EventEmitter,
		suffix?: string[],
		compilerOptions?: CompilerOptionsType

		[key: string]: any
	}

	interface RegisterOptions<CompilerOptionsType = CompilerOptionsTypeCommon> extends VBoxCompilerOptionsBase<CompilerOptionsType> {
		burnout_timeout?: number

		[key: string]: any
	}

	interface PipeOptions<CompilerOptionsType = CompilerOptionsTypeCommon> extends VBoxCompilerOptionsBase<CompilerOptionsType> {

		[key: string]: any
	}

	interface RegisterFunction<RegisterOptionsType = FxHandbag.RegisterOptions> {
		(vbox: Class_SandBox, options: RegisterOptionsType): void
	}

	interface TypedRegisterHash<SUFFIX_TYPE = string[]> {
		SUFFIX: SUFFIX_TYPE
	}

	interface Compilers {
		plain: {
			registerAsPlain: RegisterFunction
		}
		image: {
			registerImageAsBase64: RegisterFunction
		}
		stylus: {
			registerStylusAsPlain: RegisterFunction
			registerStylusAsCss: RegisterFunction
			registerStylusAsRenderer: RegisterFunction
		}
		pug: {
			registerPugAsHtml: RegisterFunction
			hackGlobalForPugRuntime (vbox: Class_SandBox): void
			registerPugAsRenderer: RegisterFunction
		}
		markdown: {
			registerMarkdownAsPlain: RegisterFunction
		}
		typescript: {
			registerTypescriptAsPlainJavascript: RegisterFunction
			registerTypescriptAsModule: RegisterFunction
		}
		rollup: {
			registerAsPlainJavascript: RegisterFunction
			registerAsRollupedJavascript: RegisterFunction
			registerAsModule: RegisterFunction
		}
		vue: {
			registerVueAsRollupedJavascript: RegisterFunction
			registerVueAsComponentOptions: RegisterFunction
			getRollupPluginVue(): any
			getDefaultPlugins(): any[]
			utils: {
				getRequireVBox: Class_SandBox
			}
		}
		riot: {
			registerRiotAsJs: RegisterFunction
		}
	}

	interface Registers {

	}

	interface RegisterUtils {

	}
	interface ExportModule {
		vboxUtils: {
			setCompilerForVbox: Fn_setCompilerForVbox
			wrapAsString: Fn_wrapAsString
		}
		compilers: Compilers
		registers: Registers
		registerUtils: RegisterUtils
	}
}

declare module "@fxjs/hangbag" {
	const mod: FxHandbag.ExportModule
	export = mod
}
