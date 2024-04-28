import { Builder, isEmpty, join } from '@deps'
import type {
	TConfigJSON,
	TData,
	TDriverParams,
	TDrowserDriverResponse,
	TDrowserService,
	TDrowserThenableWebDriver,
} from '@pkg/types.ts'
import { isValidHttpUrl } from '@pkg/utils.ts'
import { driverBrowser, driverBrowserType } from '@pkg/constants.ts'
import { generatedLog, generatedPdf } from '@pkg/export.ts'

const driver = async (
	{ browserType, exportPdf = false, exportLog = true }: TDriverParams,
): Promise<TDrowserDriverResponse> => {
	console.log({ browserType, exportPdf, exportLog })

	const data: TData = { url: '', results: [], log: [] }

	try {
		const configPath = join(Deno.cwd(), 'drowser.json')
		await Deno.stat(configPath)
		const { url }: TConfigJSON = JSON.parse(await Deno.readTextFile(configPath))

		if (isEmpty(url) || !isValidHttpUrl({ url })) {
			throw new Error(
				'An error occurred, please provide a valid url in drowser config',
			)
		}

		data.url = url
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			throw new Error(
				'An error occurred, please create drowser.json file.',
			)
		}

		if (!(error instanceof Deno.errors.NotFound)) {
			throw new Error(
				'An error occurred, please provide a valid url drowser.json file.',
			)
		}
	}

	if (isEmpty(browserType) || !driverBrowserType.includes(browserType)) {
		throw new Error(
			'An error occurred, please provide a valid browser driver',
		)
	}

	return new Promise<TDrowserDriverResponse>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const builder = new Builder().forBrowser(
			driverBrowser[browserType],
		)
			.build() as TDrowserThenableWebDriver

		const service = {
			results: [],
			generateLog: generatedLog,
			generatePdf: generatedPdf,
		} as TDrowserService

		builder.get(data.url).then(() => resolve({ builder, service }))
			.catch((err) => reject(err))
			// .finally(() => builder.quit()) //TODO: Need to find a solution to handle this internaly
			.finally(() => {
				if (exportLog) generatedLog()
				if (exportPdf) generatedPdf()
			})
	})
}

export default driver
