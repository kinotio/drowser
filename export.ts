import {} from '@deps'

const exportGeneratedLog = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	console.log('Generate Log', results)
}

const exportGeneratedPdf = (
	{ results }: { results: Array<{ [key: string]: any }> },
): void => {
	console.log('Generate PDF', results)
}

export { exportGeneratedLog, exportGeneratedPdf }
