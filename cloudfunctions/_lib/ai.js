const https = require('https');

function postJson(urlString, headers, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.request({ hostname: url.hostname, port: url.port || 443, path: `${url.pathname}${url.search}`, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(body) }, timeout: timeoutMs }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => { try { const parsed = JSON.parse(raw || '{}'); if (res.statusCode >= 400) return reject(new Error(parsed.error?.message || `AI HTTP ${res.statusCode}`)); resolve(parsed); } catch (e) { reject(e); } });
    });
    req.on('timeout', () => req.destroy(new Error('AI request timeout')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function extractJson(text) {
  const cleaned = String(text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch (_) { return null; }
}

async function chatJson({ system, user, temperature = 0.2 }) {
  const baseUrl = process.env.AI_BASE_URL || 'https://api.deepseek.com';
  const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const payload = JSON.stringify({ model: process.env.AI_MODEL || 'deepseek-chat', temperature, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] });
  const response = await postJson(endpoint, { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` }, payload, Number(process.env.AI_TIMEOUT_MS || 20000));
  return extractJson(response.choices?.[0]?.message?.content) || {};
}

module.exports = { chatJson };
