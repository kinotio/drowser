import { assert } from '../deps.ts'
import type { By, ThenableWebDriver } from '../deps.ts'

export type TDriverParams = {
	browser: TDriverBrowser
}

export type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

export type TConfigJSON = {
	url: string
	exportPdf: boolean
}

export type TDataResult = {
	id?: string
	name: string
	status: string
	timestamp?: Date
	duration: number
	month_of_test?: string
	browser: TDriverBrowser
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

export type TDriverServiceCaseParamsBuilder = Omit<
	ThenableWebDriver,
	'get' | 'quit' | 'then' | 'catch' | 'close' | 'finally'
>

export type TDriverServiceCaseParamsAssert = typeof assert

export type TDriverServiceCaseParamsBy = typeof By

type TDriverBrowserCaseParams = {
	builder: TDriverServiceCaseParamsBuilder
	assert: TDriverServiceCaseParamsAssert
	by: TDriverServiceCaseParamsBy
}

export type TDrowserServiceCase = {
	name: string
	fn: (
		params: TDriverBrowserCaseParams,
	) => void
}

export type TDrowserService = {
	cases: Array<TDrowserServiceCase>
}

export type TCaseFn = (
	params: TDriverBrowserCaseParams,
) => Promise<void>

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

export type DataPoint = {
	x: string
	y: number
}

export type DataSet = {
	id: string
	data: DataPoint[]
}

export type MonthCount = {
	name: string
	count: number
}

export type MonthValue = {
	id: string
	value: number
}

export type TJSON = {
	drowser: {
		metadata: {
			current_month: string
		}
		metrics: {
			total_tests: number
			passing_tests: number
			failed_tests: number
			test_coverage: number
			avg_test_duration: number
			flaky_tests: number
			graphs?: {
				total_tests: DataSet[]
				passing_tests: MonthCount[]
				failed_tests: MonthCount[]
				test_coverage: MonthCount[]
				avg_test_duration: MonthCount[]
				flaky_tests: MonthValue[]
			}
		}
		cases: [
			{
				id: string
				time: string
				avg_duration: number
				coverage: number
				flaky: number
				month_of_test: string
				browser: TDriverBrowser
				cases: Array<TDataResult>
			},
		]
	}
}
