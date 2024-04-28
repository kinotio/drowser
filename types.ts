import type { ThenableWebDriver } from '@pkg/deps.ts'

export type TDriverParams = {
	browserType: TDriverBrowser
	exportPdf?: boolean
	exportLog?: boolean
}

export type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

export type TConfigJSON = {
	url: string
}

export type TData = {
	url: string
	log?: Array<{ [key: string]: any }>
	results?: Array<{ [key: string]: any }>
}

export type TAssertError = {
	name: string
}

export type TDrowserThenableWebDriver = ThenableWebDriver

export type TDrowserBuilder = Omit<
	ThenableWebDriver,
	'get'
>

export type TDrowserService = {
	results: Array<{ [key: string]: any }>
	generatePdf(): Promise<string>
	generateLog(): Promise<string>
}

export type TDrowserDriverResponse = {
	builder: TDrowserBuilder
	service: TDrowserService
}
