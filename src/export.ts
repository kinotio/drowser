import {
	existsSync,
	join,
	jsPDF,
	nanoid,
	readJsonSync,
	writeJson,
	writeJsonSync,
} from '@deps'
import { generateFileName } from '@pkg/utils.ts'
import { TDataResult, TJSON } from '@pkg/types.ts'
import { getAverageDuration, getCoverage, getFlaky } from '@pkg/utils.ts'

const exportGeneratedLog = (
	{ results }: { results: Array<TDataResult> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/logs')
	const hasDir = existsSync(dirPath)

	if (!hasDir) Deno.mkdirSync(dirPath, { recursive: true })

	const logFilename = generateFileName('drowser_log', 'log')
	const logFilePath = `${dirPath}/${logFilename}`

	if (Array.isArray(results) && results.length !== 0) {
		const logFileExists = existsSync(logFilePath)

		const writeResult = () =>
			results.forEach((r) => {
				const logRow =
					`[${r.timestamp}] - Test with ${r.name} is ${r.status} with actual value is ${r.actual} and excepted to be ${r.exceptation}`
				Deno.writeTextFile(logFilePath, `${logRow}\n`, { append: true })
			})

		if (logFileExists) {
			writeResult()
			return
		}

		Deno.create(logFilePath).then(() => writeResult())
	}
}

const exportGeneratedPdf = (
	{ results }: { results: Array<TDataResult> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/pdfs')
	const asDir = existsSync(dirPath)

	if (!asDir) Deno.mkdirSync(dirPath, { recursive: true })

	const pdfFilename = generateFileName('drowser_pdf', 'pdf')
	const pdfFilePath = `${dirPath}/${pdfFilename}`

	if (Array.isArray(results) && results.length > 0) {
		const pdf = new jsPDF()
		const pdfCopy = Object.assign({}, pdf) as any
		const head = [[
			'ID',
			'NAME',
			'ACTUAL',
			'EXCEPTATION',
			'STATUS',
			'TIMESTAMP',
		]]
		const body = results.map((
			r,
			i,
		) => [i + 1, r.name, r.actual, r.exceptation, r.status, r.timestamp])
		const tableOpts = { head, body, theme: 'grid' }

		pdf.setFontSize(18)
		pdf.text('Drowser Reports', 11, 8)
		pdf.setFontSize(11)
		pdf.setTextColor(100)

		pdfCopy.autoTable(tableOpts)

		pdf.save(pdfFilePath)
	}
}

const exportJSONReport = (
	{ results, flakyTests }: {
		results: Array<TDataResult>
		flakyTests: Array<TDataResult>
	},
): void => {
	const filePath = join(Deno.cwd(), 'drowser-reports.json')
	const hasFile = existsSync(filePath)

	if (!hasFile) {
		Deno.createSync(filePath)
		writeJsonSync(filePath, {
			drowser: {
				metrics: {},
				cases: [],
			},
		}, { spaces: 2 })
	}

	if (Array.isArray(results) && results.length > 0) {
		const jsonData = readJsonSync(filePath) as TJSON

		const month = new Date().toLocaleString('default', { month: 'short' })
		console.log(month)

		jsonData.drowser.metrics = {
			total_tests: 10,
			passing_tests: 13,
			failed_tests: 100,
			test_coverage: 23,
			avg_test_duration: 2,
			flaky_tests: 23,
			graphs: {
				total_tests: [
					{
						id: 'Totals',
						data: [
							{ x: 'Jan', y: 43 },
							{ x: 'Feb', y: 137 },
							{ x: 'Mar', y: 61 },
							{ x: 'Apr', y: 145 },
							{ x: 'May', y: 26 },
							{ x: 'Jun', y: 154 },
							{ x: 'Jun', y: 72 },
							{ x: 'Jul', y: 111 },
							{ x: 'Aug', y: 157 },
							{ x: 'Sep', y: 129 },
							{ x: 'Oct', y: 150 },
							{ x: 'Nov', y: 119 },
							{ x: 'Dec', y: 72 },
						],
					},
				],
				passing_tests: [
					{ name: 'Jan', count: 111 },
					{ name: 'Feb', count: 157 },
					{ name: 'Mar', count: 129 },
					{ name: 'Apr', count: 150 },
					{ name: 'May', count: 119 },
					{ name: 'Jun', count: 72 },
					{ name: 'Jul', count: 111 },
					{ name: 'Aug', count: 157 },
					{ name: 'Sep', count: 129 },
					{ name: 'Oct', count: 150 },
					{ name: 'Nov', count: 119 },
					{ name: 'Dec', count: 72 },
				],
				failed_tests: [
					{ name: 'Jan', count: 111 },
					{ name: 'Feb', count: 157 },
					{ name: 'Mar', count: 129 },
					{ name: 'Apr', count: 150 },
					{ name: 'May', count: 119 },
					{ name: 'Jun', count: 72 },
					{ name: 'Jul', count: 111 },
					{ name: 'Aug', count: 157 },
					{ name: 'Sep', count: 129 },
					{ name: 'Oct', count: 150 },
					{ name: 'Nov', count: 119 },
					{ name: 'Dec', count: 72 },
				],
				test_coverage: [
					{ name: 'Jan', count: 111 },
					{ name: 'Feb', count: 157 },
					{ name: 'Mar', count: 129 },
					{ name: 'Apr', count: 150 },
					{ name: 'May', count: 119 },
					{ name: 'Jun', count: 72 },
					{ name: 'Jul', count: 111 },
					{ name: 'Aug', count: 157 },
					{ name: 'Sep', count: 129 },
					{ name: 'Oct', count: 150 },
					{ name: 'Nov', count: 119 },
					{ name: 'Dec', count: 72 },
				],
				avg_test_duration: [
					{ name: 'Jan', count: 111 },
					{ name: 'Feb', count: 157 },
					{ name: 'Mar', count: 129 },
					{ name: 'Apr', count: 150 },
					{ name: 'May', count: 119 },
					{ name: 'Jun', count: 72 },
					{ name: 'Jul', count: 111 },
					{ name: 'Aug', count: 157 },
					{ name: 'Sep', count: 129 },
					{ name: 'Oct', count: 150 },
					{ name: 'Nov', count: 119 },
					{ name: 'Dec', count: 72 },
				],
				flaky_tests: [
					{ id: 'Jan', value: 111 },
					{ id: 'Feb', value: 157 },
					{ id: 'Mar', value: 129 },
					{ id: 'Apr', value: 150 },
					{ id: 'May', value: 119 },
					{ id: 'Jun', value: 72 },
					{ id: 'Jun', value: 72 },
					{ id: 'Jul', value: 111 },
					{ id: 'Aug', value: 157 },
					{ id: 'Sep', value: 129 },
					{ id: 'Oct', value: 150 },
					{ id: 'Nov', value: 119 },
					{ id: 'Dec', value: 72 },
				],
			},
		}

		jsonData.drowser.cases.push({
			id: nanoid(),
			time: new Date().toISOString(),
			avg_duration: getAverageDuration({ results }),
			coverage: getCoverage({ results }),
			flaky: getFlaky({ flakyTests }),
			cases: results,
		})

		writeJson(filePath, jsonData, { spaces: 2 })
			.catch((error) => {
				console.error('Error exporting JSON report:', error)
			})
	}
}

export { exportGeneratedLog, exportGeneratedPdf, exportJSONReport }
