<p align="center">
  <img
    src="drowser.png"
    alt="Drowser"
    style="width:100%;"
  />
</p>

[![deno module](https://shield.deno.dev/x/drowser)](https://deno.land/x/drowser)
![deno compatibility](https://shield.deno.dev/deno/^1.40.2)
![license](https://img.shields.io/github/license/iamando/drowser?color=success)

A easy way to implement and write Selenium with TypeScript using Deno 🦕

## Features

- Easy handling on driver side web browser to isolate each test ✅.
- Get a daily log file to check all test process if passed or failed ✅.
- Possibility to export test case as Log ✅.
- Usage of AI for analyse the percentage of passed and failed test 🛠️.

## Configuration

You need to create a drowser.json in root directory and define some configuration like this:

```json
{
  "url": "http://url_of_the_platform_need_to_tested",
  "exportPdf": false // set to true if you want to export Pdf file
}
```

## Usage

In your test file , you can define a sample test like this:

```ts
import { driver } from "https://deno.land/x/drowser@v0.1.0/mod.ts"

driver({ browserType: 'chrome' }).then(({ service }) => {
 service.cases = [
  {
   method: 'getTitle',
   test: 'assertEquals',
   except: 'Todo App',
  },
 ]
}).catch((error) => {
 console.log(error)
})
```

With this test we only test this sample code inside a Chrome Webdriver but you can create a test for another web browser like Firefox, Edge, Safari 🚀

## LICENSE

[MIT](LICENSE).
