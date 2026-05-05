// ── Colunas da planilha App_Cadastro Oficial_Unaslaf (aba consolidado_app) ──
// A[0]:  SIAPE
// B[1]:  Nome
// C[2]:  CPF  ← chave de busca
// K[10]: Email 1
// N[13]: Telefone 1
// Q[16]: Logradouro/Endereço
// U[20]: Cidade
// W[22]: UF
// X[23]: Situação Funcional
// AI[34]: Órgão
// AT[45]: Categoria Funcional

import { checkRateLimit, validarToken, extrairToken } from '../lib/_security.js';

async function getAccessToken(credentials) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now    = Math.floor(Date.now() / 1000);
  const claim  = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
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

async function getSheetValues(sheetId, sheetName, token) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`;
  const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  return data.values || [];
}

async function updateRow(sheetId, sheetName, rowIndex, values, token) {
  const range = `${sheetName}!A${rowIndex}:P${rowIndex}`;
  const url   = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const res   = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [values] }),
  });
  return await res.json();
}

async function appendRow(sheetId, sheetName, values, token) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}!A:P:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [values] }),
  });
  return await res.json();
}

async function ensureHistoricoSheet(sheetId, token) {
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meta   = await metaRes.json();
  const exists = meta.sheets?.some(s => s.properties.title === 'Histórico');

  if (!exists) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: 'Histórico' } } }] }),
    });
    await appendRow(sheetId, 'Histórico', [
      'Origem','SIAPE','Nome','CPF','Email','Telefone','Observações',
      'Cargo','Servidor/Pensionista','Situação funcional','Órgão',
      'Endereço','Cidade','UF','Data Atualização','Alterado por'
    ], token);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit: máximo 10 salvamentos por minuto por IP
  const rl = checkRateLimit(req, 'cadastro');
  if (rl.blocked) return res.status(429).json({ error: rl.message });

  // Validação de sessão — exige token JWT válido
  const sessionToken = extrairToken(req);
  const session      = validarToken(sessionToken);
  if (!session) return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const sheetId     = process.env.SHEETS_ID;
    const token       = await getAccessToken(credentials);

    // row enviado pelo frontend com campos editáveis
    // [siape, nome, cpf, email, tel, end, cidade, uf, situacao, cargo]
    const { row, alteradoPor = 'Usuário' } = req.body;

    if (!row || !Array.isArray(row) || !row[2]) {
      return res.status(400).json({ error: 'CPF obrigatório' });
    }

    const cpfNovo   = row[2].replace(/\D/g, '');
    const dataAgora = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // 1. Busca linha existente pelo CPF (coluna C = índice 2)
    const values      = await getSheetValues(sheetId, 'consolidado_app', token);
    let foundRowIndex = -1;
    let existingRow   = [];

    for (let i = 1; i < values.length; i++) {
      const cpfExistente = (values[i][2] || '').replace(/\D/g, '');
      if (cpfExistente === cpfNovo) {
        foundRowIndex = i + 1; // Sheets é base 1
        existingRow   = values[i];
        break;
      }
    }

    if (foundRowIndex < 0) {
      return res.status(404).json({ error: 'Associado não encontrado na planilha.' });
    }

    // 2. Atualiza apenas os campos editáveis na linha existente
    // Monta cópia da linha existente e aplica apenas os campos do formulário
    const updatedRow = [...existingRow];
    while (updatedRow.length < 66) updatedRow.push('');

    // Aplica campos editáveis pelo associado
    if (row[3]) updatedRow[10] = row[3]; // Email 1  [10]
    if (row[4]) updatedRow[13] = row[4]; // Telefone 1 [13]
    if (row[5]) updatedRow[16] = row[5]; // Endereço [16]
    if (row[6]) updatedRow[20] = row[6]; // Cidade [20]
    if (row[7]) updatedRow[22] = row[7]; // UF [22]

    // Registra data e responsável nas últimas colunas
    updatedRow[65] = `Atualizado em ${dataAgora} por ${alteradoPor}`;

    // 3. Atualiza linha existente
    await updateRow(sheetId, 'consolidado_app', foundRowIndex, updatedRow, token);
    console.log(`Atualizado: CPF ${cpfNovo} linha ${foundRowIndex} por ${alteradoPor}`);

    // 4. Registra no histórico
    await ensureHistoricoSheet(sheetId, token);
    const histRow = [
      dataAgora, alteradoPor, cpfNovo,
      updatedRow[1], // Nome
      updatedRow[10], // Email
      updatedRow[13], // Telefone
    ];
    await appendRow(sheetId, 'Histórico', histRow, token);

    return res.status(200).json({
      success: true,
      action: 'atualizado',
      alteradoPor,
    });

  } catch (err) {
    console.error('Cadastro error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
