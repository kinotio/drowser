import { driver } from '../mod.ts'

driver({ browser: 'chrome' }).then(({ service }) => {
	service.cases = [
		async ({ builder, assert }) => {
			service.case_name = 'Verify Title'
			const title = await builder.getTitle()
			assert.assertEquals(title, 'Drowser')
		},
	]
}).catch((error) => console.log(error))

driver({ browser: 'firefox' }).then(({ service }) => {
	service.cases = [
		async ({ builder, assert }) => {
			service.case_name = 'Verify Title'
			const title = await builder.getTitle()
			assert.assertEquals(title, 'Drowser')
		},
	]
}).catch((error) => console.log(error))
