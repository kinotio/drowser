import { TDataResult, TIsValidHttpUrlParams } from '@pkg/types.ts'
import { caseStatus } from '@pkg/constants.ts'

const isValidHttpUrl = ({ url }: TIsValidHttpUrlParams): boolean => {
	try {
		const newUrl = new URL(url)
		return newUrl.protocol === 'http:' || newUrl.protocol === 'https:'
	} catch (err) {
		return false
	}
}

const getTimestamp = ({ type = 'log' }: { type: 'log' | 'pdf' }): string => {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')
	return type === 'log'
		? `${year}-${month}-${day}`
		: `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

const generateFileName = (prefix: string, ext: 'log' | 'pdf'): string => {
	const timestamp = getTimestamp({ type: ext })
	return `${prefix}_${timestamp}.${ext}`
}

const humanizeDuration = (durationMs: number): string => {
	const secondsTotal = Math.round(durationMs / 1000)
	const seconds = secondsTotal % 60
	const minutesTotal = Math.floor(secondsTotal / 60)
	const minutes = minutesTotal % 60
	const hoursTotal = Math.floor(minutesTotal / 60)
	const hours = hoursTotal % 24
	const days = Math.floor(hoursTotal / 24)

	let humanized = ''
	if (days > 0) humanized += `${days}d `
	if (hours > 0) humanized += `${hours}h `
	if (minutes > 0) humanized += `${minutes}m `
	if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) {
		humanized += `${seconds}s`
	}

	return humanized.trim()
}

const getAverageDuration = ({ results }: { results: Array<TDataResult> }) => {
	const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
	const averageDuration = totalDuration / results.length
	return averageDuration
}

const getCoverage = ({ results }: { results: Array<TDataResult> }) => {
	const totalTests = results.length
	const passedTests =
		results.filter((r) => r.status === caseStatus.passed).length
	const coveragePercentage = (passedTests / totalTests) * 100
	return coveragePercentage
}

const getFlaky = ({ results }: { results: Array<TDataResult> }) => {
	const flakyTestCount = (() => {
		const resultMap = new Map<string, any[]>()

		results.forEach((result) => {
			const resultsForTest = resultMap.get(result.name) || []
			resultsForTest.push(result.status)
			resultMap.set(result.name, resultsForTest)
		})

		let flakyCount = 0

		resultMap.forEach((results) => {
			if (
				results.includes(caseStatus.passed) &&
				results.includes(caseStatus.failed)
			) {
				flakyCount++
			}
		})

		return flakyCount
	})()

	return flakyTestCount
}

const updateOrCreate = (
	arr: any[],
	key: string,
	newObj: any,
	month: string,
) => {
	if (Array.isArray(arr) && arr.length > 0) {
		const index = arr.findIndex((item) => item[key] === month)
		if (index !== -1) {
			Object.assign(arr[index], newObj)
		} else {
			arr.push(newObj)
		}
	} else {
		arr.push(newObj)
	}
}

const getCurrentMonth = ({ type = 'long' }: { type: 'long' | 'short' }) => {
	return new Date().toLocaleString('default', {
		month: type,
	})
}

const result = (
	{
		id,
		name,
		status,
		duration,
		timestamp,
		month_of_test,
		browser,
	}: TDataResult,
) => {
	return {
		id,
		name,
		status,
		timestamp,
		duration,
		month_of_test,
		browser,
	}
}

const extractFromErrorMessage = (message: string) => {
	const extracted = {} as Record<string, any>

	const removeAnsiCodes = (str: string): string => {
		return str.replace(/\x1b\[[0-9;]*m/g, '')
	}
	const lines = message.split('\n')
	const cleanedLines = lines.map(removeAnsiCodes)
	const actualLine = cleanedLines.find((line: string) => line.startsWith('-'))
	const expectedLine = cleanedLines.find((line: string) => line.startsWith('+'))

	if (actualLine && expectedLine) {
		const actual = actualLine?.replace('-   ', '').trim()
		const expected = expectedLine?.replace('+   ', '').trim()

		extracted.basic = { actual, expected }
	}

	const pattern = /Unable to locate element: ({.*?})/

	const match = message.match(pattern)

	if (match) {
		const errorMessagePart = message.match(
			/no such element: (Unable to locate element:)/,
		)
		const errorMessage = errorMessagePart ? errorMessagePart[1] : ''

		const jsonString = match[1]
		const jsonObject = JSON.parse(jsonString)

		const result = {
			error: errorMessage,
			...jsonObject,
		}

		extracted.jsonObject = result
	}

	return extracted
}

export {
	extractFromErrorMessage,
	generateFileName,
	getAverageDuration,
	getCoverage,
	getCurrentMonth,
	getFlaky,
	getTimestamp,
	humanizeDuration,
	isValidHttpUrl,
	result,
	updateOrCreate,
}
