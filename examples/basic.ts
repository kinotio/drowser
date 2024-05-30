import { driver } from '../mod.ts'

driver({ browser: 'chrome' })
	.then(({ service }) => {
		service.cases = [
			{
				name: 'Verify Failed Title',
				case: async ({ builder, assert }) => {
					const title = await builder.getTitle()
					assert.assertEquals(title, 'Drowsers')
				},
			},
			{
				name: 'Verify Title',
				case: async ({ builder, assert }) => {
					const title = await builder.getTitle()
					assert.assertEquals(title, 'Drowser')
				},
			},
		]
	})
	.catch((error) => console.log(error))

driver({ browser: 'firefox' })
	.then(({ service }) => {
		service.cases = [
			{
				name: 'Verify Failed Title',
				case: async ({ builder, assert }) => {
					const title = await builder.getTitle()
					assert.assertEquals(title, 'Drowsers')
				},
			},
			{
				name: 'Verify Title',
				case: async ({ builder, assert }) => {
					const title = await builder.getTitle()
					assert.assertEquals(title, 'Drowser')
				},
			},
		]
	})
	.catch((error) => console.log(error))
