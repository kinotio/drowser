import driver from '@pkg/driver.ts'

driver({ browserType: 'chrome' }).then((builder) => {
	console.log('Builder ->', builder)
}).catch((error) => {
	console.log('Error ->', error)
})

export { driver }
