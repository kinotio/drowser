import { assert } from '@deps'
import type { ThenableWebDriver } from '@deps'

type MethodsStartingWith<T, Prefix extends string> = {
	[K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K]
}

export type TDriverParams = {
	browserType: TDriverBrowser
}

export type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

export type TConfigJSON = {
	url: string
	exportPdf: boolean
}

export type TData = {
	url: string
	results: Array<{
		name: string
		status: string
		timestamp: Date
	}>
}

export type TDrowserThenableWebDriver = ThenableWebDriver

export type TDrowserBuilder = Omit<
	ThenableWebDriver,
	'get'
>

export type TDrowserServiceCase = {
	method: keyof MethodsStartingWith<TDrowserBuilder, 'get'>
	test: keyof typeof assert
	except: unknown
}

export type TDrowserService = {
	cases: Array<TDrowserServiceCase | (() => void)>
}

export type TDrowserDriverResponse = {
	service: TDrowserService
}

export type TAssertFunction = (
	actual: unknown,
	expected: unknown,
	msg?: string,
) => void

export type TAssertError = {
	name: string
}

export type TIsValidHttpUrlParams = {
	url: string
}
