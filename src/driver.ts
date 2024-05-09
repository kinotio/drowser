import { assert, Builder, isEmpty, join, Kia } from '@deps'
import type {
	TAssertFunction,
	TConfigJSON,
	TData,
	TDataResult,
	TDriverParams,
	TDrowserDriverResponse,
	TDrowserServiceCase,
	TDrowserThenableWebDriver,
} from '@pkg/types.ts'
import { isValidHttpUrl } from '@pkg/utils.ts'
import {
	driverBrowser,
	driverBrowserType,
	seleniumExceptions,
} from '@pkg/constants.ts'
import {
	exportGeneratedLog,
	exportGeneratedPdf,
	exportJSONReport,
} from '@pkg/export.ts'

const driver = async (
	{ browser }: TDriverParams,
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

	if (isEmpty(browser) || !driverBrowserType.includes(browser)) {
		throw new Error(
			'An error occurred, please provide a valid browser driver',
		)
	}

	return new Promise<TDrowserDriverResponse>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const builder = new Builder().forBrowser(
			driverBrowser[browser],
		)
			.build() as TDrowserThenableWebDriver

		const service = { cases: [] }

		const kia = new Kia('Processing your tests')
		kia.start()

		builder.get(data.url).then(() => resolve({ service }))
			.catch((err) => {
				kia.fail('An error occurred while running tests')
				reject(seleniumExceptions[err.name])
			})
			.finally(() => {
				const { exportPdf }: TConfigJSON = JSON.parse(
					Deno.readTextFileSync(configPath),
				)
				const methodPromises: Promise<void>[] = []
				const result = (
					{ name, actual, exceptation, status }: TDataResult,
				) => {
					return {
						name,
						actual,
						exceptation,
						status,
						timestamp: new Date(),
					}
				}

				service.cases.forEach((c: TDrowserServiceCase) => {
					if (typeof c === 'object') {
						const method =
							(builder as unknown as Record<string, Function>)[c.method]

						if (typeof method === 'function') {
							const methodPromise = method.call(builder)
							let actualValue: unknown = null

							methodPromise.then((v: unknown) => {
								const assertFunction = assert[c.operator] as TAssertFunction
								actualValue = v
								assertFunction(actualValue, c.except)
								data.results.push(
									result({
										name: c.method,
										actual: actualValue,
										exceptation: c.except,
										status: 'passed',
									}),
								)
							})
								.catch(() => {
									data.results.push(
										result({
											name: c.method,
											actual: actualValue,
											exceptation: c.except,
											status: 'failed',
										}),
									)
								})

							methodPromises.push(methodPromise)
						} else {
							console.error(`Method ${c.method} not found on builder object.`)
						}
					}

					if (typeof c === 'function') {}
				})

				Promise.all(methodPromises)
					.then(() => {
						if (exportPdf) exportGeneratedPdf({ results: data.results })
						exportGeneratedLog({ results: data.results })
						exportJSONReport({ results: data.results })
					})
					.catch((error) => {
						console.error('An error occurred while processing promises:', error)
					}).finally(() => {
						kia.succeed('All tests completed')
						builder.quit()
					})
			})
	})
}

export default driver
