import { assert, Builder, isEmpty, join, Kia } from '@deps'
import type {
	TAssertFunction,
	TConfigJSON,
	TData,
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
					{ name, status }: { name: string; status: 'Passed' | 'Failed' },
				) => {
					return {
						name,
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

							methodPromise.then((v: unknown) => {
								const assertFunction = assert[c.test] as TAssertFunction
								assertFunction(v, c.except)
								data.results.push(result({ name: c.method, status: 'Passed' }))
							})
								.catch(() => {
									data.results.push(
										result({ name: c.method, status: 'Failed' }),
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
