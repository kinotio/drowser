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

export { isValidHttpUrl }
