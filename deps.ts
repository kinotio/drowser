// @deno-types="npm:@types/selenium-webdriver@^4.1.22"
import { Browser, Builder, By } from 'selenium-webdriver'
import type { By as TBy, ThenableWebDriver } from 'selenium-webdriver'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// @deno-types="https://cdn.skypack.dev/@types/lodash?dts"
import { isEmpty } from 'lodash'

import * as assert from 'assert'

import { join } from 'mod'
import { existsSync } from 'fs'
import Kia from 'kia'
import { createWriteStream } from 'node-fs'
import OpenAI from 'openai'
import { readJson, readJsonSync, writeJson, writeJsonSync } from 'jsonfile'
import { nanoid } from 'nanoid'

export {
	assert,
	Browser,
	Builder,
	By,
	createWriteStream,
	existsSync,
	isEmpty,
	join,
	jsPDF,
	Kia,
	nanoid,
	OpenAI,
	readJson,
	readJsonSync,
	TBy,
	ThenableWebDriver,
	writeJson,
	writeJsonSync,
}
