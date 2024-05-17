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
			except: 'Drowser',
		},
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowsers',
		},
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
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowsers',
		},
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
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowsers',
		},
		{
			method: 'getTitle',
			operator: 'assertEquals',
			except: 'Drowsers',
		},
	]
}).catch((error) => {
	console.log(error)
})
