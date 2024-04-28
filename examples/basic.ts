import { assert, driver } from '@pkg/lib.ts'
import type { TDrowserBuilder } from '@pkg/lib.ts'

const testTitle = (builder: TDrowserBuilder) => {
	builder.getTitle().then((t) => {
		try {
			const tVal = 'Todo App'
			assert.assertEquals(t, tVal)
		} catch ({ name }) {
			console.log(name)
		}
	})
}

driver({ browserType: 'chrome' }).then(({ builder }) => {
	testTitle(builder)
	builder.quit()
}).catch((error) => {
	console.log('Error ->', error)
})

driver({ browserType: 'firefox' }).then(({ builder }) => {
	testTitle(builder)
	builder.quit()
}).catch((error) => {
	console.log('Error ->', error)
})

driver({ browserType: 'safari' }).then(({ builder }) => {
	testTitle(builder)
	builder.quit()
}).catch((error) => {
	console.log('Error ->', error)
})

driver({ browserType: 'edge' }).then(({ builder }) => {
	testTitle(builder)
	builder.quit()
}).catch((error) => {
	console.log('Error ->', error)
})
