import type { ThenableWebDriver } from '@pkg/deps.ts'

export type TDriverParams = {
	browserType: TDriverBrowser
}

export type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

export type TConfigJSON = {
	url: string
	exportPdf: boolean
	exportLog: boolean
}

export type TData = {
	url: string
	results: Array<{ [key: string]: any }>
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
	generatePdf(): void
	generateLog(): void
}

export type TDrowserDriverResponse = {
	builder: TDrowserBuilder
}
