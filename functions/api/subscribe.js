const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESPONSE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function reply(status, ok, message) {
  return new Response(JSON.stringify({ ok, message }), { status, headers: RESPONSE_HEADERS });
}

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (origin && origin !== requestUrl.origin) {
    return reply(403, false, 'This request could not be accepted.');
  }

  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return reply(415, false, 'Please submit the form from this website.');
  }
  if (Number(request.headers.get('Content-Length')) > 2048) {
    return reply(413, false, 'The request is too large.');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return reply(400, false, 'Enter a valid email address.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return reply(400, false, 'Enter a valid email address.');
  }
  // A quiet success prevents simple bots from learning whether the trap worked.
  if (typeof body.website === 'string' && body.website.trim()) {
    return reply(200, true, 'Check your inbox for future updates.');
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return reply(400, false, 'Enter a valid email address.');
  }
  const apiKey = env.RESEND_API_KEY || env.RESEND_KEY || env.resend_api_key;
  const segmentId = env.RESEND_NEWSLETTER_SEGMENT_ID || env.RESEND_SEGMENT_ID || env.NEWSLETTER_SEGMENT_ID || env.SEGMENT_ID || env.resend_newsletter_segment_id;
  if (!apiKey || !segmentId) {
    return reply(503, false, 'Newsletter signup is temporarily unavailable. Please try later.');
  }

  const apiBase = 'https://api.resend.com/contacts';
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  const contactUrl = `${apiBase}/${encodeURIComponent(email)}`;
  const segmentUrl = `${contactUrl}/segments/${encodeURIComponent(segmentId)}`;
  const upstreamError = () => reply(502, false, 'Newsletter signup is temporarily unavailable. Please try later.');
  const success = () => reply(200, true, 'Your signup request was received.');

  try {
    let existing = await fetch(contactUrl, { headers, signal: AbortSignal.timeout(8000) });
    if (existing.ok) {
      const contact = await existing.json();
      // A past unsubscribe must not be reversed by another form submission.
      if (contact.unsubscribed) return success();
      const added = await fetch(segmentUrl, { method: 'POST', headers, signal: AbortSignal.timeout(8000) });
      return added.ok || added.status === 409 ? success() : upstreamError();
    }
    if (existing.status !== 404) return upstreamError();

    const created = await fetch(apiBase, {
      method: 'POST', headers,
      body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: env.RESEND_NEWSLETTER_SEGMENT_ID }] }),
      signal: AbortSignal.timeout(8000),
    });
    if (created.ok) return success();
    if (created.status !== 409) return upstreamError();

    // Another submission may have created this contact after our lookup.
    existing = await fetch(contactUrl, { headers, signal: AbortSignal.timeout(8000) });
    if (!existing.ok) return upstreamError();
    const contact = await existing.json();
    if (contact.unsubscribed) return success();
    const added = await fetch(segmentUrl, { method: 'POST', headers, signal: AbortSignal.timeout(8000) });
    return added.ok || added.status === 409 ? success() : upstreamError();
  } catch {
    return reply(503, false, 'Newsletter signup is temporarily unavailable. Please try later.');
  }
}
