type TIsValidHttpUrlParams = {
	url: string
}

const isValidHttpUrl = ({ url }: TIsValidHttpUrlParams): boolean => {
	try {
		const newUrl = new URL(url)
		return newUrl.protocol === 'http:' || newUrl.protocol === 'https:'
	} catch (err) {
		return false
	}
}

const getTimestamp = (): string => {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')
	return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

const generateLogFileName = (prefix: string): string => {
	const timestamp = getTimestamp()
	return `${prefix}_${timestamp}.log`
}

export { generateLogFileName, getTimestamp, isValidHttpUrl }
