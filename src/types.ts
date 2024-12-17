import { assert } from '../deps.ts'
import type { By, ThenableWebDriver } from '../deps.ts'

export type DriverParams = {
	browser: DriverBrowser
}

export type DriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

export type ConfigJSON = {
	url: string
	exportPdf: boolean
}

export type DataResult = {
	id?: string
	name: string
	status: string
	timestamp?: Date
	duration: number
	month_of_test?: string
	browser: DriverBrowser
}

export type Data = {
	url: string
	results: Array<DataResult>
}

export type DrowserThenableWebDriver = ThenableWebDriver

export type DrowserBuilder = Omit<
	ThenableWebDriver,
	'get'
>

export type DriverServiceCaseParamsBuilder = Omit<
	ThenableWebDriver,
	'get' | 'quit' | 'then' | 'catch' | 'close' | 'finally'
>

export type DriverServiceCaseParamsAssert = typeof assert

export type DriverServiceCaseParamsBy = typeof By

export type DriverBrowserCaseParams = {
	builder: DriverServiceCaseParamsBuilder
	assert: DriverServiceCaseParamsAssert
	by: DriverServiceCaseParamsBy
}

export type DrowserServiceCase = {
	name: string
	fn: (
		params: DriverBrowserCaseParams,
	) => void
}

export type DrowserService = {
	cases: Array<DrowserServiceCase>
}

export type CaseFn = (
	params: DriverBrowserCaseParams,
) => Promise<void>

export type DrowserDriverResponse = {
	service: DrowserService
}

export type AssertFunction = (
	actual: unknown,
	expected: unknown,
	msg?: string,
) => void

export type AssertError = {
	name: string
}

export type IsValidHttpUrlParams = {
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

export type ReportSchema = {
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
				browser: DriverBrowser
				cases: Array<DataResult>
			},
		]
	}
}

const types = {
	TDriverParams: {} as DriverParams,
	DriverBrowser: {} as DriverBrowser,
	ConfigJSON: {} as ConfigJSON,
	Data: {} as Data,
	DrowserThenableWebDriver: {} as DrowserThenableWebDriver,
	DrowserBuilder: {} as DrowserBuilder,
	DriverServiceCaseParamsBuilder: {} as DriverServiceCaseParamsBuilder,
	DriverServiceCaseParamsAssert: {} as DriverServiceCaseParamsAssert,
	DriverServiceCaseParamsBy: {} as DriverServiceCaseParamsBy,
	DriverBrowserCaseParams: {} as DriverBrowserCaseParams,
	DrowserServiceCase: {} as DrowserServiceCase,
	DrowserService: {} as DrowserService,
	CaseFn: {} as CaseFn,
	DrowserDriverResponse: {} as DrowserDriverResponse,
	AssertFunction: {} as AssertFunction,
	AssertError: {} as AssertError,
	IsValidHttpUrlParams: {} as IsValidHttpUrlParams,
	DataPoint: {} as DataPoint,
	DataSet: {} as DataSet,
	MonthCount: {} as MonthCount,
	MonthValue: {} as MonthValue,
	ReportSchema: {} as ReportSchema,
}

export default types
