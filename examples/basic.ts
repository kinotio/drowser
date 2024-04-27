import { driver } from '@pkg/lib.ts'

driver({ browserType: 'chrome' }).then((builder) => {
	console.log('Builder ->', builder)
}).catch((error) => {
	console.log('Error ->', error)
})
