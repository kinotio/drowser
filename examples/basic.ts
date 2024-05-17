import { driver } from '../mod.ts'

driver({ browser: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowser',
		},
	]
}).catch((error) => {
	console.log(error)
})
