export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const sheetId     = process.env.SHEETS_ID; // ID da planilha (não a URL CSV)
    const accessToken = await getAccessToken(credentials);
    const { row }     = req.body; // array com os valores na ordem das colunas

    if (!row || !Array.isArray(row)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    // Adiciona timestamp no final
    const values = [...row, new Date().toLocaleString('pt-BR')];

    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Associados!A:K:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [values] }),
      }
    );

    const data = await sheetsRes.json();
    console.log('Sheets response:', JSON.stringify(data));

    if (!sheetsRes.ok) {
      return res.status(sheetsRes.status).json({ error: data.error?.message || 'Erro ao gravar' });
    }

    return res.status(200).json({ success: true, updatedRange: data.updates?.updatedRange });

  } catch (err) {
    console.error('Cadastro error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function getAccessToken(credentials) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now    = Math.floor(Date.now() / 1000);
  const claim  = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const signingInput = `${header}.${claim}`;
  const pemKey       = credentials.private_key.replace(/\\n/g, '\n');
  const pemBody      = pemKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
  const binaryKey    = Buffer.from(pemBody, 'base64');

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, Buffer.from(signingInput));
  const jwt       = `${signingInput}.${Buffer.from(signature).toString('base64url')}`;

  const tokenRes  = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error('Token error: ' + JSON.stringify(tokenData));
  return tokenData.access_token;
}
