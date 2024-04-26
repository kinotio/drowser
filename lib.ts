import driver from '@pkg/driver.ts'

await driver({ browserType: 'chrome' }).then((builder) => {
	console.log('->', builder)
}).catch((error) => {
	console.log(error)
})

export { driver }
