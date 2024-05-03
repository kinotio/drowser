import { driver } from '../mod.ts'

driver({ browserType: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			method: 'getTitle',
			test: 'assert',
			except: 'Todo App',
		},
	]
}).catch((error) => {
	console.log('Error ->', error)
})
