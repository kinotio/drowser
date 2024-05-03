import { driver } from '../mod.ts'

driver({ browserType: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			method: 'getTitle',
			test: 'assertEquals',
			except: 'Todo App',
		},
	]
}).catch((error) => {
	console.log(error)
})
