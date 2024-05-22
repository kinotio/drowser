import { assert, nanoid } from '@deps'
import {
	TAssertFunction,
	TDataResult,
	TDrowserServiceCase,
} from '@pkg/types.ts'
import { caseStatus, dataResultType } from '@pkg/constants.ts'
import { getCurrentMonth } from '@pkg/utils.ts'

const flakyRunner = (
	{ builder, service, browser, result, methodPromises }: {
		builder: any
		service: any
		browser: any
		result: any
		methodPromises: any
	},
) => {
	const month = getCurrentMonth({ type: 'short' })
	const countRun = 5

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
									type: dataResultType.object,
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
										type: dataResultType.object,
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
	})(countRun)

	return flakyCases
}

export { flakyRunner }
