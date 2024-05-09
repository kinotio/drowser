import { Browser } from '@deps'

const driverBrowserList: Array<string> = ['chrome', 'firefox', 'safari', 'edge']

const driverBrowsers: Record<string, string> = {
	chrome: Browser.CHROME,
	firefox: Browser.FIREFOX,
	safari: Browser.SAFARI,
	edge: Browser.EDGE,
}

const seleniumExceptions: Record<string, string> = {
	WebDriverError: 'General WebDriver error.',
	NoSuchElementError: 'The requested element could not be found in the DOM.',
	TimeoutError: 'The operation did not complete within the specified timeout.',
	SessionNotCreatedError: 'A new session could not be created.',
	ScriptTimeoutError: 'A script execution timeout occurred.',
	StaleElementReferenceError:
		'The referenced element is no longer present in the DOM.',
	ElementNotVisibleError:
		'The referenced element is present in the DOM but is not visible.',
}

export { driverBrowserList, driverBrowsers, seleniumExceptions }
