import { existsSync, join, jsPDF } from '@deps'
import { generateFileName } from '@pkg/utils.ts'

const exportGeneratedLog = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/logs')
	const asDir = existsSync(dirPath)

	if (!asDir) Deno.mkdirSync(dirPath, { recursive: true })

	const logFilename = generateFileName('drowser_log', 'log')
	const logFilePath = `${dirPath}/${logFilename}`

	if (Array.isArray(results) && results.length !== 0) {
		Deno.create(logFilePath).then(() => {
			results.forEach((r) => {
				const logRow = `[${r.timestamp}] - Test with ${r.name} is ${r.status}`
				Deno.writeTextFile(logFilePath, `${logRow}\n`, { append: true })
			})
		})
	}
}

const exportGeneratedPdf = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/pdfs')
	const asDir = existsSync(dirPath)

	if (!asDir) Deno.mkdirSync(dirPath, { recursive: true })

	const pdfFilename = generateFileName('drowser_pdf', 'pdf')
	const pdfFilePath = `${dirPath}/${pdfFilename}`

	if (Array.isArray(results) && results.length > 0) {
		const pdf = new jsPDF()
		const pdfCopy = Object.assign({}, pdf) as any

		const head = [['ID', 'NAME', 'STATUS', 'TIMESTAMP']]

		const data = results.map((r, i) => [i + 1, r.name, r.status, r.timestamp])

		pdf.setFontSize(18)
		pdf.text('Drowser Reports', 11, 8)
		pdf.setFontSize(11)
		pdf.setTextColor(100)

		pdfCopy.autoTable({
			head,
			body: data,
			theme: 'grid',
		})

		pdf.save(pdfFilePath)
	}
}

export { exportGeneratedLog, exportGeneratedPdf }
