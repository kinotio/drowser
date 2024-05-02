import { assert, Builder, isEmpty, join } from '@deps'
import type {
	TConfigJSON,
	TData,
	TDriverParams,
	TDrowserDriverResponse,
	TDrowserServiceCase,
	TDrowserThenableWebDriver,
} from '@pkg/types.ts'
import { isValidHttpUrl } from '@pkg/utils.ts'
import { driverBrowser, driverBrowserType } from '@pkg/constants.ts'
import { exportGeneratedLog, exportGeneratedPdf } from '@pkg/export.ts'

const driver = async (
	{ browserType }: TDriverParams,
): Promise<TDrowserDriverResponse> => {
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

	return new Promise<TDrowserDriverResponse>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const builder = new Builder().forBrowser(
			driverBrowser[browserType],
		)
			.build() as TDrowserThenableWebDriver

		const service = { cases: [] }

		console.log('Processing your tests')

		builder.get(data.url).then(() => resolve({ service }))
			.catch((err) => reject(err))
			.finally(() => {
				const { exportLog, exportPdf }: TConfigJSON = JSON.parse(
					Deno.readTextFileSync(configPath),
				)

				service.cases.forEach((c: TDrowserServiceCase) => {
					if (typeof c === 'object') {
						const method =
							(builder as unknown as Record<string, Function>)[c.method]

						if (typeof method === 'function') {
							const methodPromise = method.call(builder)

							methodPromise.then((v: unknown) => assert[c.test](v, c.except))
								.catch(
									({ name, message }: { name: string; message: unknown }) => {
										console.log(name)
										console.log(message)
									},
								)
						} else {
							console.error(`Method ${c.method} not found on builder object.`)
						}
					}

					if (typeof c === 'function') console.log('function')
				})

				builder.quit()

				if (exportLog) exportGeneratedLog({ results: data.results })
				if (exportPdf) exportGeneratedPdf({ results: data.results })
			})
	})
}

export default driver
