<p align="center">
  <img
    src="drowser.png"
    alt="Drowser"
    style="width:100%;"
  />
</p>

![build](https://github.com/andostronaut/drowser/workflows/build/badge.svg)
[![deno module](https://shield.deno.dev/x/drowser)](https://deno.land/x/drowser)
![deno compatibility](https://shield.deno.dev/deno/^1.40.2)
![license](https://img.shields.io/github/license/andostronaut/drowser?color=success)

A easy way to implement and write Selenium with TypeScript using Deno 🦕

## Features

- Easy handling on driver side web browser to isolate each test ✅.
- Get a daily log file to check all test process if passed or failed ✅.
- Export each test case inside the reports ✅.

## Configuration

Create a drowser.json in root directory and define some configuration like this:

- `url`: The url of platform or website that need to be test

```json
{
  "url": "http://url_of_the_platform_need_to_be_tested"
}
```

## Deno 2

Install npm dependecies on `node_modules` with this command:

```sh
deno install --allow-scripts
```

## Usage

In test file , Define a sample test like this:

With this test we only test this sample code inside a Chrome ,Firefox but create a test for another web browser like Edge, Safari 🚀

```ts
import { driver } from "https://deno.land/x/drowser@v0.1.6/mod.ts";

driver({ browser: "chrome" })
  .then(({ service }) => {
    service.cases = [
      {
        name: "Verify Failed Title",
        fn: async ({ builder, assert }) => {
          const title = await builder.getTitle();
          assert.assertEquals(title, "Drowsers");
        },
      },
      {
        name: "Verify Title",
        fn: async ({ builder, assert }) => {
          const title = await builder.getTitle();
          assert.assertEquals(title, "Drowser");
        },
      },
    ];
  })
  .catch((error) => console.log(error));

driver({ browser: "firefox" })
  .then(({ service }) => {
    service.cases = [
      {
        name: "Verify Failed Title",
        fn: async ({ builder, assert }) => {
          const title = await builder.getTitle();
          assert.assertEquals(title, "Drowsers");
        },
      },
      {
        name: "Verify Title",
        fn: async ({ builder, assert }) => {
          const title = await builder.getTitle();
          assert.assertEquals(title, "Drowser");
        },
      },
    ];
  })
  .catch((error) => console.log(error));
```

## Drowser Studio

Each test case is saved inside the `drowser-reports.json` file , and this file is exploitable inside the `Drowser Studio` who is developed by the `Kinotio` Team in this [repo](https://github.com/kinotio/drowser-studio) , who is open-source

Import this reports inside of the studio to visualize all the metrics for main cases or each test case

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
