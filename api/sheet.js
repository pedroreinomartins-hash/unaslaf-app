// Lê a planilha via Google Sheets API e retorna JSON estruturado
// Retorna JSON em vez de CSV para preservar campos vazios corretamente
// (CSV desalinha colunas quando há campos vazios no meio da linha)

import { checkRateLimit } from '../lib/_security.js';

async function getAccessToken(credentials) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now    = Math.floor(Date.now() / 1000);
  const claim  = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const signingInput = `${header}.${claim}`;
  const pemKey  = credentials.private_key.replace(/\\n/g, '\n');
  const pemBody = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
  const binaryKey = Buffer.from(pemBody, 'base64');

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, Buffer.from(signingInput));
  const jwt = `${signingInput}.${Buffer.from(signature).toString('base64url')}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error('Token error: ' + JSON.stringify(tokenData));
  return tokenData.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Rate limit: máximo 10 consultas por minuto por IP
  const rl = checkRateLimit(req, 'sheet');
  if (rl.blocked) return res.status(429).json({ error: rl.message });

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const sheetId     = process.env.SHEETS_ID;
    const token       = await getAccessToken(credentials);

    // Lê a aba consolidado_app
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/consolidado_app?majorDimension=ROWS`;
    const sheetsRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!sheetsRes.ok) {
      const err = await sheetsRes.json();
      return res.status(sheetsRes.status).json({ error: err.error?.message || 'Sheets API error' });
    }

    const data = await sheetsRes.json();
    const rawRows = data.values || [];

    if (rawRows.length === 0) {
      return res.status(200).json({ rows: [] });
    }

    // Determina o número total de colunas pelo cabeçalho (primeira linha)
    const numCols = rawRows[0].length;

    // Normaliza TODAS as linhas para terem exatamente numCols colunas
    // A Sheets API omite células vazias no final — isso corrige o desalinhamento
    const rows = rawRows.map(row => {
      const normalized = [...row];
      while (normalized.length < numCols) normalized.push('');
      return normalized;
    });

    // Retorna JSON estruturado — preserva campos vazios corretamente
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ rows });

  } catch (err) {
    console.error('Sheet error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
