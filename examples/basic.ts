import { driver } from '../mod.ts'

driver({ browser: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowser',
		},
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowsers',
		},
		async (builder, assert) => {
			const title = await builder.getTitle()
			assert.assertEquals(title, 'Drowsers')
		},
	]
}).catch((error) => console.log('Error from client', error))

// driver({ browser: 'firefox' }).then(({ service }) => {
// 	service.cases = [
// 		{
// 			method: 'getTitle',
// 			operator: 'assertEquals',
// 			except: 'Drowser',
// 		},
// 		{
// 			method: 'getTitle',
// 			operator: 'assertEquals',
// 			except: 'Drowsers',
// 		},
// 	]
// }).catch((error) => console.log(error))
