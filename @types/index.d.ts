/// <reference types="@fibjs/types" />

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
		hooks: RegisterOptions['hooks'],
		emitter: Class_EventEmitter,
		suffix: string[],
		compilerOptions: CompilerOptionsTypeCommon
		env: string
	}

	interface RegisterOptions<CompilerOptionsType = CompilerOptionsTypeCommon> {
		burnout_timeout?: number,
		hooks?: {
			[k: string]: Function | {
				is_once?: boolean
				handler: Function
			}
		},
		emitter?: Class_EventEmitter,
		suffix?: string[],
		compilerOptions?: CompilerOptionsType
		env?: string

		[key: string]: any
	}

	interface RegisterFunction<RegisterOptionsType = FxHandbag.RegisterOptions> {
		(vbox: Class_SandBox, options: RegisterOptionsType): void
	}

	interface TypedRegisterHash<SUFFIX_TYPE = string[]> {
		SUFFIX: SUFFIX_TYPE
	}

	interface Compilers {
		requireAsPath(buf?: Class_Buffer, info?): string
		requireAsPlain(buf?: Class_Buffer, info?): string
	}

	interface Registers {
		plain: {
			registerAsPlain: RegisterFunction
		}
		image: {
			registerImageAsBase64: RegisterFunction
		}
		ｇraphql: {
			registerGraphQLParser: RegisterFunction
			registerGraphQLAsQueryBuilder: RegisterFunction
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

declare module "@fxjs/handbag" {
	const mod: FxHandbag.ExportModule
	export = mod
}
