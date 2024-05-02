import { existsSync, join } from '@deps'
import { generateLogFileName } from '@pkg/utils.ts'

const exportGeneratedLog = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	const dirPath = join(Deno.cwd(), 'drowser/logs')
	const asDir = existsSync(dirPath)

	if (!asDir) Deno.mkdirSync(dirPath, { recursive: true })

	const logFilename = generateLogFileName('drowser_log')
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

	console.log(results)
}

export { exportGeneratedLog, exportGeneratedPdf }
