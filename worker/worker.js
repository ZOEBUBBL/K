/**
 * Cloudflare Worker — the only piece that must live on a server.
 *
 * Its whole job: confirm a payment really happened, then hand back a
 * short-lived URL to the clean image. The clean image never sits in the
 * public folder, so there is nothing to scrape from devtools.
 *
 * Deploy:  npx wrangler deploy
 *
 * Secrets: npx wrangler secret put STRIPE_SECRET_KEY
 *          npx wrangler secret put SIGNING_KEY        (any long random string)
 *
 * Bindings (wrangler.toml):
 *   [[r2_buckets]]
 *   binding = "VAULT"
 *   bucket_name = "keyhole-vault"
 *
 * Put the full pose reel in R2 as: poses-full.mp4
 */

const ALLOWED_ORIGIN = 'https://YOURNAME.github.io'; // lock this to your page
const CLEAN_KEY = 'poses-full.mp4';
const TTL_SECONDS = 300;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return cors(new Response(null, {status: 204}));

    // ---- 1. verify + issue a signed ticket ----
    if (url.pathname === '/redeem' && request.method === 'POST') {
      let body;
      try { body = await request.json(); }
      catch { return cors(bad('Malformed request.')); }

      const sessionId = body.session_id;
      if (!sessionId) return cors(bad('No session provided.'));

      // Follow-gate mode: no payment to verify, just issue the ticket.
      if (sessionId !== 'follow') {
        const ok = await verifyStripeSession(sessionId, env.STRIPE_SECRET_KEY);
        if (!ok) return cors(bad('Payment not confirmed.', 402));
      }

      const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
      const sig = await sign(`${CLEAN_KEY}:${exp}`, env.SIGNING_KEY);
      const asset = `${url.origin}/asset?exp=${exp}&sig=${sig}`;
      return cors(json({url: asset}));
    }

    // ---- 2. serve the clean image against a valid ticket ----
    if (url.pathname === '/asset' && request.method === 'GET') {
      const exp = Number(url.searchParams.get('exp') || 0);
      const sig = url.searchParams.get('sig') || '';

      if (exp < Math.floor(Date.now() / 1000)) return cors(bad('Link expired.', 410));

      const expected = await sign(`${CLEAN_KEY}:${exp}`, env.SIGNING_KEY);
      if (!timingSafeEqual(sig, expected)) return cors(bad('Invalid link.', 403));

      const obj = await env.VAULT.get(CLEAN_KEY);
      if (!obj) return cors(bad('Asset missing.', 404));

      return cors(new Response(obj.body, {
        headers: {
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, no-store'
        }
      }));
    }

    return cors(bad('Not found.', 404));
  }
};

/* ---------- helpers ---------- */

async function verifyStripeSession(sessionId, key) {
  const r = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {headers: {Authorization: `Bearer ${key}`}}
  );
  if (!r.ok) return false;
  const s = await r.json();
  return s.payment_status === 'paid';
}

async function sign(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: {'Content-Type': 'application/json'}
  });
}

function bad(message, status = 400) {
  return json({error: message}, status);
}

function cors(res) {
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(res.body, {status: res.status, headers: h});
}
