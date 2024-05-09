import {
	existsSync,
	join,
	jsPDF,
	readJsonSync,
	writeJson,
	writeJsonSync,
} from '@deps'
import { generateFileName } from '@pkg/utils.ts'
import { TDataResult, TJSON } from '@pkg/types.ts'

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
	{ results }: { results: Array<TDataResult> },
): void => {
	const filePath = join(Deno.cwd(), 'drowser-reports.json')
	const hasFile = existsSync(filePath)

	if (!hasFile) {
		Deno.createSync(filePath)
		writeJsonSync(filePath, {
			drowser: {
				cases: [],
			},
		}, { spaces: 2 })
	}

	if (Array.isArray(results) && results.length > 0) {
		const jsonData = readJsonSync(filePath) as TJSON

		jsonData.drowser.cases.push({
			time: new Date().toISOString(),
			cases: results,
		})

		writeJson(filePath, jsonData, { spaces: 2 })
			.then(() => {
				console.log('JSON report exported successfully.')
			})
			.catch((error) => {
				console.error('Error exporting JSON report:', error)
			})
	}
}

export { exportGeneratedLog, exportGeneratedPdf, exportJSONReport }
