import { existsSync, join, PDFDocument } from '@deps'
import { generateFileName } from '@pkg/utils.ts'

const exportGeneratedLog = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/logs')
	const asDir = existsSync(dirPath)

	if (!asDir) Deno.mkdirSync(dirPath, { recursive: true })

	const logFilename = generateFileName('drowser_log', 'log')
	const logFilePath = `${dirPath}/${logFilename}`

	Deno.create(logFilePath).then(() => {
		results.forEach((r) => {
			const logRow = `[${r.timestamp}] - Test with ${r.name} is ${r.status}`
			Deno.writeTextFile(logFilePath, `${logRow}\n`, { append: true })
		})
	})
}

const exportGeneratedPdf = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/pdfs')
	const asDir = existsSync(dirPath)

	if (!asDir) Deno.mkdirSync(dirPath, { recursive: true })

	const pdfFilename = generateFileName('drowser_pdf', 'pdf')
	const pdfFilePath = `${dirPath}/${pdfFilename}`

	PDFDocument.create().then((doc) => {
		const page = doc.addPage()

		results.forEach((r) => {
			page.drawText(`[${r.timestamp}] - Test with ${r.name} is ${r.status}`, {
				x: 100,
				y: 700,
				size: 12,
			})
		})

		doc.save().then((bytes) => {
			Deno.create(pdfFilePath).then(() => Deno.writeFile(pdfFilePath, bytes))
		})
	})
}

export { exportGeneratedLog, exportGeneratedPdf }
