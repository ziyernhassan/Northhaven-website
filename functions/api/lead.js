/* ============================================================
   POST /api/lead — demo-request intake (Cloudflare Pages Function)

   Storage:    D1 binding named `DB` (see d1-migrations/0001_leads.sql)
   Alerts:     Telegram — reuses the automation project's bot;
               env vars TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
   Contract:   the site's form treats ANY 2xx as success, so this
               endpoint must stay honest with its status codes.
   ============================================================ */

const LIMITS = { name: 120, business: 160, phone: 40, message: 2000 };
const RATE_LIMIT_PER_IP_PER_HOUR = 5;

export async function onRequestPost({ request, env, waitUntil }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: 'invalid_body' });
  }
  if (!data || typeof data !== 'object') {
    return json(400, { ok: false, error: 'invalid_body' });
  }

  /* honeypot: bots fill every field they find; humans never see this one */
  if (typeof data.company_website === 'string' && data.company_website.trim() !== '') {
    return json(200, { ok: true });
  }

  const lead = {
    name: str(data.name, LIMITS.name),
    business: str(data.business, LIMITS.business),
    phone: str(data.phone, LIMITS.phone),
    message: str(data.message, LIMITS.message),
  };

  /* mirror the client-side checks — never trust the browser */
  if (!lead.name || !lead.business || !lead.phone) {
    return json(400, { ok: false, error: 'missing_fields' });
  }
  if (lead.phone.replace(/\D/g, '').length < 7) {
    return json(400, { ok: false, error: 'bad_phone' });
  }

  if (!env.DB) {
    console.error('D1 binding missing');
    return json(500, { ok: false, error: 'not_configured' });
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ua = (request.headers.get('User-Agent') || '').slice(0, 300);

  try {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM leads
       WHERE ip = ?1 AND created_at > datetime('now','-1 hour')`
    ).bind(ip).first();
    if (row && row.n >= RATE_LIMIT_PER_IP_PER_HOUR) {
      return json(429, { ok: false, error: 'rate_limited' });
    }

    await env.DB.prepare(
      `INSERT INTO leads (name, business, phone, message, ip, user_agent)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
    ).bind(lead.name, lead.business, lead.phone, lead.message, ip, ua).run();
  } catch (e) {
    console.error('lead storage failed', e);
    return json(500, { ok: false, error: 'storage_failed' });
  }

  /* storage succeeded — the lead is safe. Alert best-effort. */
  waitUntil(notify(env, lead));
  return json(200, { ok: true });
}

/* ---------- helpers ---------- */

function str(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function notify(env, lead) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    '\uD83C\uDF10 Website lead',
    '',
    'Name: ' + lead.name,
    'Business: ' + lead.business,
    'WhatsApp: ' + lead.phone,
  ];
  if (lead.message) lines.push('', 'Asked: ' + lead.message);

  try {
    await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
    });
  } catch (e) {
    console.error('telegram notify failed', e);
  }
}
