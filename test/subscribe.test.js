import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/subscribe.js';

const env = { RESEND_API_KEY: 'test-key', RESEND_NEWSLETTER_SEGMENT_ID: 'test-segment' };
const endpoint = 'https://likhithv.com/api/subscribe';

function context(body, options = {}) {
  return {
    env: options.env ?? env,
    request: new Request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': options.contentType ?? 'application/json', ...(options.origin ? { Origin: options.origin } : {}) },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  };
}

test('newsletter API contract', async (t) => {
  await t.test('rejects invalid email without calling Resend', async () => {
    const original = globalThis.fetch;
    globalThis.fetch = () => { throw new Error('Unexpected API request'); };
    try {
      const response = await onRequestPost(context({ email: 'invalid' }));
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { ok: false, message: 'Enter a valid email address.' });
    } finally { globalThis.fetch = original; }
  });

  await t.test('rejects a cross-origin submission', async () => {
    const response = await onRequestPost(context({ email: 'reader@example.com' }, { origin: 'https://other.example' }));
    assert.equal(response.status, 403);
  });

  await t.test('reports missing private configuration', async () => {
    const response = await onRequestPost(context({ email: 'reader@example.com' }, { env: {} }));
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
  });

  await t.test('creates a new contact in the newsletter segment', async () => {
    const original = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return new Response(null, { status: calls.length === 1 ? 404 : 201 });
    };
    try {
      const response = await onRequestPost(context({ email: ' Reader@Example.com ' }));
      assert.equal(response.status, 200);
      assert.equal((await response.json()).ok, true);
      assert.equal(calls[0].url, 'https://api.resend.com/contacts/reader%40example.com');
      assert.equal(calls[1].url, 'https://api.resend.com/contacts');
      assert.deepEqual(JSON.parse(calls[1].init.body), {
        email: 'reader@example.com',
        unsubscribed: false,
        segments: [{ id: 'test-segment' }],
      });
    } finally { globalThis.fetch = original; }
  });

  await t.test('adds an existing active contact to the segment', async () => {
    const original = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async (url) => {
      calls.push(url);
      return calls.length === 1
        ? Response.json({ email: 'reader@example.com', unsubscribed: false })
        : Response.json({ id: 'test-segment' });
    };
    try {
      const response = await onRequestPost(context({ email: 'reader@example.com' }));
      assert.equal(response.status, 200);
      assert.equal(calls[1], 'https://api.resend.com/contacts/reader%40example.com/segments/test-segment');
    } finally { globalThis.fetch = original; }
  });

  await t.test('does not resubscribe a contact who unsubscribed', async () => {
    const original = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return Response.json({ email: 'reader@example.com', unsubscribed: true });
    };
    try {
      const response = await onRequestPost(context({ email: 'reader@example.com' }));
      assert.equal(response.status, 200);
      assert.equal(calls, 1);
    } finally { globalThis.fetch = original; }
  });

  await t.test('does not claim success if Resend rejects contact creation', async () => {
    const original = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => new Response(null, { status: ++calls === 1 ? 404 : 500 });
    try {
      const response = await onRequestPost(context({ email: 'reader@example.com' }));
      assert.equal(response.status, 502);
      assert.equal((await response.json()).ok, false);
    } finally { globalThis.fetch = original; }
  });
});
