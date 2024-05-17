import { assert } from '@deps'
import type { ThenableWebDriver } from '@deps'

type MethodsStartingWith<T, Prefix extends string> = {
	[K in keyof T as K extends `${Prefix}${string}` ? K : never]: T[K]
}

export type TDriverParams = {
	browser: TDriverBrowser
}

export type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

export type TConfigJSON = {
	url: string
	exportPdf: boolean
}

export type TDataResult = {
	id: string
	name: string
	actual: unknown
	exceptation: unknown
	status: string
	timestamp: Date
	duration: number
}

export type TData = {
	url: string
	results: Array<TDataResult>
}

export type TDrowserThenableWebDriver = ThenableWebDriver

export type TDrowserBuilder = Omit<
	ThenableWebDriver,
	'get'
>

export type TDrowserServiceCase = {
	method: keyof MethodsStartingWith<TDrowserBuilder, 'get'>
	operator: keyof typeof assert
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

export type TJSON = {
	drowser: {
		cases: [
			{
				id: string
				time: string
				avg_duration: number
				coverage: number
				flaky: number
				cases: Array<TDataResult>
			},
		]
	}
}
