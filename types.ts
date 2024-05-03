import type { ThenableWebDriver } from '@pkg/deps.ts'
import { assert } from '@deps'

type AssertFunction = keyof typeof assert

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
	results: Array<{
		name: string
		status: string
		timestamp: Date
	}>
}

export type TAssertError = {
	name: string
}

export type TDrowserThenableWebDriver = ThenableWebDriver

export type TDrowserBuilder = Omit<
	ThenableWebDriver,
	'get'
>

export type TDrowserServiceCase = {
	method: 'getTitle'
	test: AssertFunction
	except: string | undefined
}

export type TDrowserService = {
	cases: Array<TDrowserServiceCase | (() => void)>
}

export type TDrowserDriverResponse = {
	service: TDrowserService
}
