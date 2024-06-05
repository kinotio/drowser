import { assert } from '../deps.ts'
import { isValidHttpUrl, getTimestamp, generateFileName, humanizeDuration } from '../src/utils.ts'

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

Deno.test(
  "generateFileName should return correct filename for pdf type",
  () => {
    const timestamp = /^prefix_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.pdf$/;
    assert.assert(generateFileName("prefix", "pdf").match(timestamp));
  }
);

Deno.test("generateFileName should handle empty prefix", () => {
  const tm = getTimestamp({ type: "log" });
  assert.assertEquals(generateFileName("", "log"), `_${tm}.log`);
  const timestamp = /^_\d{4}-\d{2}-\d{2}\.log$/;
  assert.assert(generateFileName("", "log").match(timestamp));
});

Deno.test(
  "humanizeDuration should return correct duration string for 0 milliseconds",
  () => {
    assert.assertEquals(humanizeDuration(0), "0s");
  }
);

Deno.test(
  "humanizeDuration should return correct duration string for less than a minute",
  () => {
    assert.assertEquals(humanizeDuration(5000), "5s");
    assert.assertEquals(humanizeDuration(59000), "59s");
  }
);

Deno.test(
  "humanizeDuration should return correct duration string for minutes",
  () => {
    assert.assertEquals(humanizeDuration(60000), "1m");
    assert.assertEquals(humanizeDuration(120000), "2m");
  }
);

Deno.test(
  "humanizeDuration should return correct duration string for hours",
  () => {
    assert.assertEquals(humanizeDuration(3600000), "1h");
    assert.assertEquals(humanizeDuration(7200000), "2h");
  }
);

Deno.test(
  "humanizeDuration should return correct duration string for days",
  () => {
    assert.assertEquals(humanizeDuration(86400000), "1d");
    assert.assertEquals(humanizeDuration(172800000), "2d");
  }
);

Deno.test(
  "humanizeDuration should return correct duration string for combined units",
  () => {
    assert.assertEquals(humanizeDuration(90000), "1m 30s");
    assert.assertEquals(
      humanizeDuration(7200000 + 120000),
      "2h 2m"
    );
    assert.assertEquals(
      humanizeDuration(172800000 + 7200000 + 120000),
      "2d 2h 2m"
    );
  }
);

