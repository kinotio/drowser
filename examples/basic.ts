import { driver } from '../mod.ts'

driver({ browser: 'chrome' }).then(({ service }) => {
	service.cases = [
		{
			name: 'Verify Title',
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowser',
		},
		async ({ builder, assert }) => {
			service.name = 'Verify Title from function'
			const title = await builder.getTitle()
			assert.assertEquals(title, 'Drowsers')
		},
	]
}).catch((error) => console.log(error))

driver({ browser: 'firefox' }).then(({ service }) => {
	service.cases = [
		{
			name: 'Verify Title',
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowser',
		},
		async ({ builder, assert }) => {
			service.name = 'Verify Title from function'
			const title = await builder.getTitle()
			assert.assertEquals(title, 'Drowsers')
		},
	]
}).catch((error) => console.log(error))
