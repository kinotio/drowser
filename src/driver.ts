import { assert, Builder, By, isEmpty, join, Kia } from '@deps'
import type {
	TCaseFn,
	TConfigJSON,
	TData,
	TDriverParams,
	TDriverServiceCaseParamsBuilder,
	TDrowserDriverResponse,
	TDrowserServiceCase,
	TDrowserThenableWebDriver,
} from '@pkg/types.ts'
import { isValidHttpUrl, result as resultData } from '@pkg/utils.ts'
import {
	caseStatus,
	driverBrowserList,
	driverBrowsers,
	seleniumExceptions,
} from '@pkg/constants.ts'
import {
	exportGeneratedLog,
	exportGeneratedPdf,
	exportJSONReport,
} from '@pkg/export.ts'

const driver = async ({
	browser,
}: TDriverParams): Promise<TDrowserDriverResponse> => {
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
			throw new Error('An error occurred, please create drowser.json file.')
		}

		if (!(error instanceof Deno.errors.NotFound)) {
			throw new Error(
				'An error occurred, please provide a valid url drowser.json file.',
			)
		}
	}

	if (isEmpty(browser) || !driverBrowserList.includes(browser)) {
		throw new Error('An error occurred, please provide a valid browser driver')
	}

	return new Promise<TDrowserDriverResponse>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const builder = new Builder()
			.forBrowser(driverBrowsers[browser])
			.build() as TDrowserThenableWebDriver

		const service = { cases: [] }

		const kia = new Kia('Processing your tests')
		kia.start()

		builder
			.get(data.url)
			.then(() => resolve({ service }))
			.catch((err) => {
				kia.fail('An error occurred while running tests')
				reject(seleniumExceptions[err.name])
			})
			.finally(() => {
				const { exportPdf }: TConfigJSON = JSON.parse(
					Deno.readTextFileSync(configPath),
				)
				const methodPromises: Promise<void>[] = []

				service.cases.forEach((c: TDrowserServiceCase) => {
					if (typeof c === 'object') {
						const omitedBuilder =
							builder as unknown as TDriverServiceCaseParamsBuilder
						const megaBuilder = {
							builder: omitedBuilder,
							assert,
							by: By,
						}
						const method = c.fn as TCaseFn
						const methodPromise = method(megaBuilder)

						const start = performance.now()

						methodPromise
							.then(() => {
								const end = performance.now()
								data.results.push(
									resultData({
										name: c.name,
										status: caseStatus.passed,
										timestamp: new Date(),
										duration: end - start,
										browser,
									}),
								)
							})
							.catch(() => {
								const end = performance.now()
								data.results.push(
									resultData({
										name: c.name,
										status: caseStatus.failed,
										duration: end - start,
										browser,
									}),
								)
							})

						methodPromises.push(methodPromise)
					}
				})

				const exportGeneratedFiles = () => {
					if (exportPdf) exportGeneratedPdf({ results: data.results })
					exportGeneratedLog({ results: data.results })
					exportJSONReport({
						results: data.results,
						browser,
					})
				}

				Promise.allSettled(methodPromises)
					.catch((error) => reject(error))
					.finally(() => {
						exportGeneratedFiles()
						kia.succeed(`All tests completed on ${browser}`)
						builder.quit()
					})
			})
	})
}

export default driver
