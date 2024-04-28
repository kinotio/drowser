import {} from '@deps'

const generatedLog = (): Promise<string> => {
	return new Promise<string>((resolve) => {
		resolve('Generate Log')
	})
}

const generatedPdf = (): Promise<string> => {
	return new Promise<string>((resolve) => {
		resolve('Generate Pdf')
	})
}

export { generatedLog, generatedPdf }
