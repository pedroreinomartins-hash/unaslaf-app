export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const results = {};

  // 1. Verifica variáveis
  const sheetsId   = process.env.SHEETS_ID;
  const serviceAcc = process.env.GOOGLE_SERVICE_ACCOUNT;

  results.SHEETS_ID = sheetsId ? `OK = ${sheetsId}` : 'NÃO DEFINIDO';
  results.GOOGLE_SERVICE_ACCOUNT = serviceAcc ? `OK (${serviceAcc.length} chars)` : 'NÃO DEFINIDO';

  try {
    if (!sheetsId || !serviceAcc) throw new Error('Variáveis não definidas');

    const credentials = JSON.parse(serviceAcc);
    results.service_account = credentials.client_email;

    // Gera token
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const now    = Math.floor(Date.now() / 1000);
    const claim  = Buffer.from(JSON.stringify({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600, iat: now,
    })).toString('base64url');
    const signingInput = `${header}.${claim}`;
    const pemKey  = credentials.private_key.replace(/\\n/g, '\n');
    const pemBody = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
    const binaryKey = Buffer.from(pemBody, 'base64');
    const cryptoKey = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, Buffer.from(signingInput));
    const jwt = `${signingInput}.${Buffer.from(signature).toString('base64url')}`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Token falhou: ' + JSON.stringify(tokenData));
    results.token = 'OK';

    // Testa leitura da aba consolidado_app
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/consolidado_app?majorDimension=ROWS`;
    const sheetsRes = await fetch(url, { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
    const sheetsData = await sheetsRes.json();

    if (!sheetsRes.ok) {
      results.sheets = `ERRO ${sheetsRes.status}: ${sheetsData.error?.message}`;
    } else {
      const rows = sheetsData.values || [];
      results.sheets_linhas = rows.length;
      results.sheets_cabecalho = rows[0]?.slice(0, 5);
      results.sheets_num_colunas = rows[0]?.length;

      // Busca CPF
      const cpf = (req.query?.cpf || '32859264817').replace(/\D/g, '');
      let found = false;
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        // Normaliza linha
        while (row.length < (rows[0]?.length || 64)) row.push('');
        const cpfCell = (row[2] || '').replace(/\D/g, '');
        if (cpfCell === cpf) {
          found = true;
          results.cpf_resultado = `ENCONTRADO na linha ${i+1}`;
          results.cpf_dados = { siape: row[0], nome: row[1], cpf: row[2], email: row[10], telefone: row[12] };
          break;
        }
      }
      if (!found) results.cpf_resultado = `NÃO ENCONTRADO nas ${rows.length} linhas`;
    }
  } catch(err) {
    results.erro = err.message;
  }

  return res.status(200).json(results);
}
