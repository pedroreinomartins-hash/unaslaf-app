// api/auth-send.js — Verifica CPF, gera código, grava na planilha e envia via WhatsApp
// Arquitetura correta para serverless: usa Google Sheets como store do código temporário

const { google } = require('googleapis');

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function getSheetsClient(readonly = true) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: readonly
      ? ['https://www.googleapis.com/auth/spreadsheets.readonly']
      : ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth: await auth.getClient() });
}

async function findAssociate(cpf) {
  const sheets   = await getSheetsClient(true);
  const sheetId  = process.env.SHEETS_ID;
  const cleanCPF = cpf.replace(/\D/g, '');

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:P',
  });

  const rows = res.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowCPF = (row[3] || '').replace(/\D/g, '');
    if (rowCPF === cleanCPF) {
      return {
        rowIndex: i + 1,
        siape:    row[1] || '',
        nome:     row[2] || '',
        cpf:      row[3] || '',
        email:    row[4] || '',
        telefone: row[5] || '',
        cargo:    row[7] || '',
        tipo:     row[8] || '',
        situacao: row[9] || '',
        orgao:    row[10] || '',
        endereco: row[11] || '',
        cidade:   row[12] || '',
        uf:       row[13] || '',
      };
    }
  }
  return null;
}

async function sendWhatsApp(phone, code) {
  const instance = process.env.ZAPI_INSTANCE;
  const token    = process.env.ZAPI_TOKEN;
  const client   = process.env.ZAPI_CLIENT_TOKEN;

  const url = `https://api.z-api.io/instances/${instance}/token/${token}/send-text`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Token': client
    },
    body: JSON.stringify({
      phone,
      message: `🔐 *UNASLAF — Código de Acesso*\n\nSeu código é: *${code}*\n\nExpira em 10 minutos. Não compartilhe com ninguém.`
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Z-API: ${resp.status} ${txt}`);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { cpf } = req.body || {};
    if (!cpf) return res.status(400).json({ error: 'CPF não informado' });

    const associate = await findAssociate(cpf);
    if (!associate) {
      return res.status(404).json({
        error: 'CPF não encontrado',
        message: 'CPF não cadastrado. Acesse unaslaf.org.br para solicitar cadastro.'
      });
    }

    if (!associate.telefone) {
      return res.status(400).json({
        error: 'Sem WhatsApp cadastrado',
        message: 'Não há número de WhatsApp vinculado a este CPF. Entre em contato com a UNASLAF.'
      });
    }

    // Gera código e grava na coluna Q da planilha: "CÓDIGO:EXPIRA_EM"
    const code    = generateCode();
    const expires = Date.now() + 10 * 60 * 1000;

    const sheets = await getSheetsClient(false);
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEETS_ID,
      range: `Sheet1!Q${associate.rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[`${code}:${expires}`]] }
    });

    await sendWhatsApp(associate.telefone, code);

    const tel    = associate.telefone.toString();
    const masked = tel.length >= 4 ? '***' + tel.slice(-4) : '****';

    return res.status(200).json({
      success: true,
      message: `Código enviado para o WhatsApp ${masked}`,
      nome: associate.nome.split(' ')[0]
    });

  } catch (err) {
    console.error('[auth-send] Erro:', err);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
