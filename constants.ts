import { Browser } from '@deps'

const driverBrowserType = ['chrome', 'firefox', 'safari', 'edge']

const driverBrowser = {
	chrome: Browser.CHROME,
	firefox: Browser.FIREFOX,
	safari: Browser.SAFARI,
	edge: Browser.EDGE,
}

export { driverBrowser, driverBrowserType }
