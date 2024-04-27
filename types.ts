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
	log?: any
	results?: any
}

export type TAssertError = {
	name: string
}

export type TOmitedThenableWebDriver = Omit<ThenableWebDriver, 'get'>
