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

- Easy handling on driver side web browser to isolate each test ✅
- Possibility to export test case as PDF 🛠️
- Possibility to export test case as Log 🛠️
- Usage of AI for analyse the percentage of success and failed test 🛠️

## Configuration

You need to create a drowser.json in root directory and define some configuration like this:

```json
{
  "url": "http://url_of_the_platform_need_to_tested"
}
```

## Installation

You can define it inside your import_map.json config, like this:

```json
{
  "imports": {
    "drowser": "https://deno.land/x/drowser/lib.ts"
  }
}
```

And call it inside deps.ts very easy, like this:

```js
import { assert, driver } from "drowser"
export { assert, driver }
```

## Usage

In you test file , you can define a sample test like this:

```js
import { assert , driver } from "./deps.ts"
import type { TDrowserBuilder } from "drowser"

const testTitle = (builder: TDrowserBuilder) => {
  builder.getTitle().then((t) => {
  try {
   const tVal = "Todo App"
   assert.assertEquals(t, tVal)
  } catch (err) {
   console.log(err)
  }
 })
}

driver({ browserType: "chrome" }).then(({ builder }) => {
 testTitle(builder)
 builder.quit()
}).catch((err) => {
 console.log(err)
})
```

With this test we only test this sample code inside a Chrome Webdriver but you can create a test for another web browser like Firefox, Edge, Safari 🚀

## LICENSE

[MIT](LICENSE).
