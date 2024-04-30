import { Builder, isEmpty, join } from '@deps'
import type {
	TConfigJSON,
	TData,
	TDriverParams,
	TDrowserBuilder,
	TDrowserThenableWebDriver,
} from '@pkg/types.ts'
import { isValidHttpUrl } from '@pkg/utils.ts'
import { driverBrowser, driverBrowserType } from '@pkg/constants.ts'
import { exportGeneratedLog, exportGeneratedPdf } from '@pkg/export.ts'

const driver = async (
	{ browserType }: TDriverParams,
): Promise<TDrowserBuilder> => {
	const data: TData = { url: '', results: [] }
	const configPath = join(Deno.cwd(), 'drowser.json')

	try {
		await Deno.stat(configPath)
		const { url }: TConfigJSON = JSON.parse(
			await Deno.readTextFile(configPath),
		)

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

	return new Promise<TDrowserBuilder>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const builder = new Builder().forBrowser(
			driverBrowser[browserType],
		)
			.build() as TDrowserThenableWebDriver

		builder.get(data.url).then(() => resolve(builder))
			.catch((err) => reject(err))
			// .finally(() => builder.quit()) //TODO: Need to find a solution to handle this internaly
			.finally(() => {
				const { exportLog, exportPdf }: TConfigJSON = JSON.parse(
					Deno.readTextFileSync(configPath),
				)

				if (exportLog) exportGeneratedLog({ results: data.results })
				if (exportPdf) exportGeneratedPdf({ results: data.results })
			})
	})
}

export default driver
