import {} from '@deps'
import type { DriverParams } from '@pkg/types/driver.ts'

const driver = (
	{ browserType, exportPdf = false, exportLog = true }: DriverParams,
): void => {
	console.log({ browserType, exportPdf, exportLog })
}

export default driver
