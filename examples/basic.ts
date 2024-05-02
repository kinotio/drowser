import { driver } from '../mod.ts'

driver({ browserType: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			method: 'getTitle',
			test: 'assertEquals',
			except: 'Todo Apps',
		},
		() => {
			console.log('test function')
		},
	]
}).catch((error) => {
	console.log('Error ->', error)
})
