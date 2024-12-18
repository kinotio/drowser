import { assert, Builder, By, isEmpty, join, Kia } from '../deps.ts'
import type {
	CaseFn,
	ConfigJSON,
	Data,
	DriverParams,
	DriverServiceCaseParamsBuilder,
	DrowserDriverResponse,
	DrowserServiceCase,
	DrowserThenableWebDriver,
} from './types.ts'
import { isValidHttpUrl, result as resultData } from './utils.ts'
import {
	caseStatus,
	driverBrowserList,
	driverBrowsers,
	seleniumExceptions,
} from './constants.ts'
import { exportGeneratedLog, exportJSONReport } from './export.ts'

const driver = async ({
	browser,
}: DriverParams): Promise<DrowserDriverResponse> => {
	const data: Data = { url: '', results: [] }
	const configPath = join(Deno.cwd(), 'drowser.json')

	try {
		await Deno.stat(configPath)
		const { url }: ConfigJSON = JSON.parse(
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

	if (isEmpty(browser) || !driverBrowserList.includes(browser)) {
		throw new Error(
			'An error occurred, please provide a valid browser driver',
		)
	}

	return new Promise<DrowserDriverResponse>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const builder = new Builder()
			.forBrowser(driverBrowsers[browser])
			.build() as DrowserThenableWebDriver

		const service = { cases: [] }

		const kia = new Kia('Processing your tests')
		kia.start()

		builder
			.get(data.url)
			.then(() => resolve({ service }))
			.catch((error: Record<string, string>) => {
				kia.fail('An error occurred while running tests')
				reject(seleniumExceptions[error.name])
			})
			.finally(() => {
				const methodPromises: Promise<void>[] = []

				service.cases.forEach((c: DrowserServiceCase) => {
					if (typeof c === 'object') {
						const omitedBuilder =
							builder as unknown as DriverServiceCaseParamsBuilder
						const megaBuilder = {
							builder: omitedBuilder,
							assert,
							by: By,
						}
						const method = c.fn as CaseFn
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
