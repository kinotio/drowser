import { Browser, Builder, isEmpty, join } from '@deps'
import type { ThenableWebDriver } from '@deps'
import type {
	TConfigJSON,
	TData,
	TDriverParams,
	TOmitedThenableWebDriver,
} from '@pkg/types.ts'
import { isValidHttpUrl } from '@pkg/utils.ts'

const driverBrowserType = ['chrome', 'firefox', 'safari', 'edge']

const driverBrowser = {
	chrome: Browser.CHROME,
	firefox: Browser.FIREFOX,
	safari: Browser.SAFARI,
	edge: Browser.EDGE,
}

const driver = async (
	{ browserType, exportPdf = false, exportLog = true }: TDriverParams,
): Promise<TOmitedThenableWebDriver> => {
	console.log({ browserType, exportPdf, exportLog })

	const data: TData = { url: '' }

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

	return new Promise<TOmitedThenableWebDriver>((resolve, reject) => {
		if (isEmpty(data.url) || !isValidHttpUrl({ url: data.url })) reject()

		const driver = new Builder().forBrowser(
			driverBrowser[browserType],
		)
			.build() as ThenableWebDriver

		driver.get(data.url).then(() => resolve(driver)).catch((err) => reject(err))
		// .finally(() => driver.quit()) //TODO: Need to find a solution to handle this internaly
	})
}

export default driver
