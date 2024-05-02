import { driver } from '../mod.ts'

const testCases = [
	{
		method: 'getTitles',
		test: 'assertEquals',
		except: 'Todo App',
	},
	() => {
		console.log('test function')
	},
] as any

driver({ browserType: 'chrome' }).then(({ service }) => {
	service.cases = testCases
}).catch((error) => {
	console.log('Error ->', error)
})

// driver({ browserType: 'firefox' }).then(({ service }) => {
// 	service.cases = testCases
// }).catch((error) => {
// 	console.log('Error ->', error)
// })

// driver({ browserType: 'safari' }).then(({ service }) => {
// 	service.cases = testCases
// }).catch((error) => {
// 	console.log('Error ->', error)
// })

// driver({ browserType: 'edge' }).then(({ service }) => {
// 	service.cases = testCases
// }).catch((error) => {
// 	console.log('Error ->', error)
// })
