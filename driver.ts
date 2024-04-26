import { Browser, Builder, isEmpty } from '@deps'

type TDriverParams = {
	browserType: TDriverBrowser
	exportPdf?: boolean
	exportLog?: boolean
}

type TDriverBrowser = 'chrome' | 'firefox' | 'safari' | 'edge'

const driverBrowserType = ['chrome', 'firefox', 'safari', 'edge']

const driverBrowser = {
	chrome: Browser.CHROME,
	firefox: Browser.FIREFOX,
	safari: Browser.SAFARI,
	edge: Browser.EDGE,
}

const driver = async (
	{ browserType, exportPdf = false, exportLog = true }: TDriverParams,
): Promise<any> => {
	console.log({ browserType, exportPdf, exportLog })

	try {
		const config = await Deno.stat('config.json')
		console.log(config)

		if (isEmpty(browserType) || !driverBrowserType.includes(browserType)) {
			throw new Error(
				'An error occurred, please provide a valid browser driver',
			)
		}

		return new Promise((resolve) => {
			new Builder().forBrowser(driverBrowser[browserType])
				.build()
			resolve('Builder')
		})
	} catch (error) {
		if (!(error instanceof Deno.errors.NotFound)) {
			throw new Error(
				'An error occurred, please create config.json file and set url here',
			)
		}
	}
}

export default driver
