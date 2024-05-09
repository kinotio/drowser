import { driver } from '../mod.ts'

driver({ browser: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Todo App',
		},
	]
}).catch((error) => {
	console.log(error)
})
