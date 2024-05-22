import { assert, Builder, isEmpty, join, Kia, nanoid } from '@deps'
import type {
	TAssertFunction,
	TCaseFn,
	TConfigJSON,
	TData,
	TDataResult,
	TDriverParams,
	TDrowserDriverResponse,
	TDrowserServiceCase,
	TDrowserThenableWebDriver,
} from '@pkg/types.ts'
import { getCurrentMonth, isValidHttpUrl } from '@pkg/utils.ts'
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
					{
						id,
						name,
						actual,
						exceptation,
						status,
						duration,
						timestamp,
						month_of_test,
						browser,
					}: TDataResult,
				) => {
					return {
						id,
						name,
						actual,
						exceptation,
						status,
						timestamp,
						duration,
						month_of_test,
						browser,
					}
				}

				service.cases.forEach((c: TDrowserServiceCase) => {
					const start = performance.now()

					if (typeof c === 'object') {
						const objectStingified = JSON.stringify(c)
						console.log(objectStingified)

						const method =
							(builder as unknown as Record<string, Function>)[c.method]

						if (typeof method === 'function') {
							const methodPromise = method.call(builder)
							let actualValue: unknown = null

							methodPromise.then((v: unknown) => {
								const assertFunction = assert[c.operator] as TAssertFunction
								actualValue = v
								assertFunction(actualValue, c.except)

								const end = performance.now()

								data.results.push(
									result({
										id: nanoid(),
										name: c.method,
										actual: actualValue,
										exceptation: c.except,
										status: caseStatus.passed,
										timestamp: new Date(),
										duration: end - start,
										month_of_test: month,
										browser,
									}),
								)
							})
								.catch(() => {
									const end = performance.now()

									data.results.push(
										result({
											id: nanoid(),
											name: c.method,
											actual: actualValue,
											exceptation: c.except,
											status: caseStatus.failed,
											timestamp: new Date(),
											duration: end - start,
											month_of_test: month,
											browser,
										}),
									)
								})

							methodPromises.push(methodPromise)
						} else {
							reject(
								`Method ${c.method} not found on builder object.`,
							)
						}
					}

					if (typeof c === 'function') {
						const method = c as TCaseFn
						const methodPromise = method(builder, assert)
						const fnStringified = c.toString()
						console.log(fnStringified)

						methodPromise.then((v: unknown) => {
							console.log(v)
						}).catch((error) => {
							console.log(error.name)
						})

						methodPromises.push(methodPromise)
					}
				})

				const flakyCases: Array<TDataResult> = []
				;((runs: number) => {
					for (let i = 0; i < runs; i++) {
						service.cases.forEach((c: TDrowserServiceCase) => {
							const start = performance.now()

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

										const end = performance.now()

										flakyCases.push(
											result({
												id: nanoid(),
												name: c.method,
												actual: actualValue,
												exceptation: c.except,
												status: caseStatus.passed,
												timestamp: new Date(),
												duration: end - start,
												month_of_test: month,
												browser,
											}),
										)
									})
										.catch(() => {
											const end = performance.now()

											flakyCases.push(
												result({
													id: nanoid(),
													name: c.method,
													actual: actualValue,
													exceptation: c.except,
													status: caseStatus.failed,
													timestamp: new Date(),
													duration: end - start,
													month_of_test: month,
													browser,
												}),
											)
										})

									methodPromises.push(methodPromise)
								} else {
									console.error(
										`Method ${c.method} not found on builder object.`,
									)
								}
							}

							if (typeof c === 'function') {}
						})
					}
				})(5)

				Promise.all(methodPromises)
					.then(() => {
						if (exportPdf) exportGeneratedPdf({ results: data.results })
						exportGeneratedLog({ results: data.results })
						exportJSONReport({
							results: data.results,
							flakyTests: flakyCases,
							browser,
						})
					})
					.catch((error) => reject(error)).finally(() => {
						kia.succeed(`All tests completed on ${browser}`)
						builder.quit()
					})
			})
	})
}

export default driver
