import { assert } from '../deps.ts'
import { isValidHttpUrl, getTimestamp } from '../src/utils.ts'

Deno.test('isValidHttpUrl should return true for valid HTTP URLs', () => {
	assert.assertEquals(isValidHttpUrl({ url: 'http://example.com' }), true)
	assert.assertEquals(isValidHttpUrl({ url: 'https://www.google.com' }), true)
	assert.assertEquals(isValidHttpUrl({ url: 'http://localhost:8080' }), true)
})

Deno.test('isValidHttpUrl should return false for invalid URLs', () => {
	assert.assertEquals(isValidHttpUrl({ url: 'example.com' }), false)
	assert.assertEquals(isValidHttpUrl({ url: 'ftp://example.com' }), false)
	assert.assertEquals(isValidHttpUrl({ url: 'mailto:test@example.com' }), false)
})

Deno.test('isValidHttpUrl should handle empty', () => {
	assert.assertEquals(isValidHttpUrl({ url: '' }), false)
})

Deno.test(
  'getTimestamp should return "log" timestamp format for default type',
  () => {
    const timestamp = getTimestamp({ type: 'log'});
    assert.assert(timestamp.match(/^\d{4}-\d{2}-\d{2}$/));
  }
);

Deno.test(
  'getTimestamp should return "pdf" timestamp format for type "pdf"',
  () => {
    const timestamp = getTimestamp({ type: "pdf" });
    assert.assert(timestamp.match(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/));
  }
);

