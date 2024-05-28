import { assert, Builder, By, isEmpty, join, Kia, nanoid } from '@deps'
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
import {
	getCurrentMonth,
	isValidHttpUrl,
	result as resultData,
} from '@pkg/utils.ts'
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

	if (isEmpty(browser) || !driverBrowserList.includes(browser)) {
		throw new Error(
			'An error occurred, please provide a valid browser driver',
		)
	}

	return new Promise<TDrowserDriverResponse>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const month = getCurrentMonth({ type: 'short' })

		const builder = new Builder().forBrowser(
			driverBrowsers[browser],
		)
			.build() as TDrowserThenableWebDriver

		const service = { case_name: '', cases: [] }

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

				service.cases.forEach((c: TDrowserServiceCase) => {
					if (typeof c === 'function') {
						const omitedBuilder =
							builder as unknown as TDriverServiceCaseParamsBuilder
						const megaBuilder = {
							builder: omitedBuilder,
							assert,
							by: By,
						}
						const method = c as TCaseFn
						const methodPromise = method(megaBuilder)
						if (isEmpty(service.case_name)) return
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
					.then((results) => {
						const start = performance.now()
						results.forEach((result) => {
							if (result.status === 'fulfilled') {
								const end = performance.now()
								data.results.push(
									resultData({
										id: nanoid(),
										name: service.case_name,
										status: caseStatus.passed,
										timestamp: new Date(),
										duration: end - start,
										month_of_test: month,
										browser,
									}),
								)
							} else {
								const end = performance.now()
								data.results.push(
									resultData({
										id: nanoid(),
										name: service.case_name,
										status: caseStatus.failed,
										timestamp: new Date(),
										duration: end - start,
										month_of_test: month,
										browser,
									}),
								)
							}
						})
					})
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
