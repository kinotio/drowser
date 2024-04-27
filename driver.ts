import { Browser, Builder, isEmpty, join } from '@deps'
import type { ThenableWebDriver } from '@deps'
import { isValidHttpUrl } from '@pkg/utils.ts'

type TDriverParams = {
	browserType: TDriverBrowser
	exportPdf?: boolean
	exportLog?: boolean
}

type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

type TConfigJSON = {
	url: string
}

const driverBrowserType = ['chrome', 'firefox', 'safari', 'edge']

const driverBrowser = {
	chrome: Browser.CHROME,
	firefox: Browser.FIREFOX,
	safari: Browser.SAFARI,
	edge: Browser.EDGE,
}

const driver = async (
	{ browserType, exportPdf = false, exportLog = true }: TDriverParams,
): Promise<ThenableWebDriver> => {
	console.log({ browserType, exportPdf, exportLog })

	let appUrl: string

	try {
		const configPath = join(Deno.cwd(), 'drowser.json')
		await Deno.stat(configPath)
		const { url }: TConfigJSON = JSON.parse(await Deno.readTextFile(configPath))

		if (isEmpty(url) || !isValidHttpUrl({ url })) {
			throw new Error(
				'An error occurred, please provide a valid url in drowser config',
			)
		}

		appUrl = url
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

	return new Promise<ThenableWebDriver>((resolve, reject) => {
		const driver = new Builder().forBrowser(
			driverBrowser[browserType],
		)
			.build() as ThenableWebDriver

		driver.then(() => {
			driver.get(appUrl).then(() => resolve(driver))
		}).catch((err) => reject(err)).finally(() => driver.quit())
	})
}

export default driver
