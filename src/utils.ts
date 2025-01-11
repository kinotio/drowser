import { nanoid } from '../deps.ts'
import { DataResult, IsValidHttpUrlParams } from './types.ts'
import { caseStatus } from './constants.ts'

const isValidHttpUrl = ({ url }: IsValidHttpUrlParams): boolean => {
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

const generateFileName = (prefix: string, ext: 'log'): string => {
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

const getAverageDuration = ({ results }: { results: Array<DataResult> }) => {
	const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
	const averageDuration = totalDuration / results.length
	return averageDuration
}

const getCoverage = ({ results }: { results: Array<DataResult> }) => {
	const totalTests = results.length
	const passedTests =
		results.filter((r) => r.status === caseStatus.passed).length
	const coveragePercentage = (passedTests / totalTests) * 100
	return coveragePercentage
}

const getFlaky = ({ results }: { results: Array<DataResult> }) => {
	const flakyTestCount = (() => {
		const resultMap = new Map<string, unknown[]>()

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
	arr: Array<Record<string, unknown>>,
	key: string,
	newObj: Record<string, unknown>,
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
		name,
		status,
		duration,
		browser,
	}: DataResult,
) => {
	return {
		id: nanoid(),
		name,
		status,
		timestamp: new Date(),
		duration,
		month_of_test: getCurrentMonth({ type: 'short' }),
		browser,
	}
}

export {
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
