// api/auth-send.js — Verifica CPF, gera código, grava na planilha col BM, envia via WhatsApp

const { google } = require('googleapis');

// Mapeamento real da planilha App_Cadastro Oficial_Unaslaf:
// A=SIAPE, B=Nome, C=CPF, K(10)=EmailPrincipal, M(12)=Telefone1, N(13)=Telefone2
// P(15)=Logradouro, Q(16)=Número, S(18)=Bairro, T(19)=Cidade, U(20)=CEP, V(21)=UF
// BM(64) = código temporário (reservado pelo sistema)

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function getSheetsClient(readonly) {
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
  const cleanCPF = cpf.replace(/\D/g, '');

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEETS_ID,
    range: 'Sheet1!A:V',
  });

  const rows = res.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    const row    = rows[i];
    const rowCPF = (row[2] || '').replace(/\D/g, '');
    if (rowCPF === cleanCPF) {
      return {
        rowIndex:  i + 1,
        siape:     row[0]  || '',
        nome:      (row[1] || '').trim(),
        cpf:       row[2]  || '',
        email:     row[10] || '',
        telefone1: row[12] || '',
        telefone2: row[13] || '',
        logradouro:row[15] || '',
        numero:    row[16] || '',
        bairro:    row[18] || '',
        cidade:    row[19] || '',
        cep:       row[20] || '',
        uf:        row[21] || '',
        situacao:  row[22] || '',
      };
    }
  }
  return null;
}

async function sendWhatsApp(phone, code) {
  const cleanPhone = phone.toString().replace(/\D/g, '');
  const instance   = process.env.ZAPI_INSTANCE;
  const token      = process.env.ZAPI_TOKEN;
  const client     = process.env.ZAPI_CLIENT_TOKEN;

  const url  = `https://api.z-api.io/instances/${instance}/token/${token}/send-text`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Client-Token': client },
    body: JSON.stringify({
      phone: cleanPhone,
      message: `🔐 *UNASLAF — Código de Acesso*\n\nSeu código é: *${code}*\n\nExpira em 10 minutos. Não compartilhe.`
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Z-API ${resp.status}: ${txt}`);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { cpf } = req.body || {};
    if (!cpf) return res.status(400).json({ error: 'CPF não informado' });

    const assoc = await findAssociate(cpf);
    if (!assoc) {
      return res.status(404).json({
        error: 'CPF não encontrado',
        message: 'CPF não cadastrado como associado da UNASLAF. Acesse unaslaf.org.br para solicitar o cadastro.'
      });
    }

    const telefone = assoc.telefone1 || assoc.telefone2;
    if (!telefone) {
      return res.status(400).json({
        error: 'Sem WhatsApp cadastrado',
        message: 'Não há número de telefone cadastrado para este CPF. Entre em contato com a UNASLAF.'
      });
    }

    const code    = generateCode();
    const expires = Date.now() + 10 * 60 * 1000;

    const sheets = await getSheetsClient(false);
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEETS_ID,
      range:         `Sheet1!BM${assoc.rowIndex}`,
      valueInputOption: 'RAW',
      requestBody:   { values: [[`${code}:${expires}`]] }
    });

    await sendWhatsApp(telefone, code);

    const tel    = telefone.toString().replace(/\D/g, '');
    const masked = tel.length >= 4 ? '***' + tel.slice(-4) : '****';

    return res.status(200).json({
      success: true,
      message: `Código enviado para o WhatsApp ${masked}`,
      nome: assoc.nome.split(' ')[0]
    });

  } catch (err) {
    console.error('[auth-send]', err.message);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
