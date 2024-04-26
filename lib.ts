import driver from '@pkg/driver.ts'

await driver({ browserType: 'chrome' }).then((builder) => {
	console.log('Builder ->', builder)
}).catch((error) => {
	console.log('Error ->', error)
})

export { driver }
